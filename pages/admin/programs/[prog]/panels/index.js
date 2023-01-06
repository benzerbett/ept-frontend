import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Pagination from '../../../../../components/common/Pagination';
import ProgramsNavbar from '../../../../../components/common/ProgramsNavbar';
import { getResource } from '../../../../../utilities';

function Panels() {
    const router = useRouter()
    const { prog } = router.query
    const [programData, setProgramData] = useState(null)


    const [panels, setPanels] = useState([])
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [totalRecords, setTotalRecords] = useState(0)
    const [count, setCount] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [pageLinks, setPageLinks] = useState([])
    const [search, setSearch] = useState('')
    const [isSearch, setIsSearch] = useState(false)

    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);

    const fetchProgram = (resource) => {
        getResource(resource).then((data) => {
            if (data.status === true) {
                setProgramData(data?.data)

                setStatus('')   // ('success')
                setMessage('')  // 
            } else {
                setStatus('error')
                setMessage(data.message)
            }
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setStatus('error')
            setMessage('Error fetching programs: ' + err.message || err)
            setLoading(false)
        })
    }


    const fetchPanels = (resource) => {
        getResource(resource).then((data) => {
            if (data.status === true) {
                setPanels(data?.data?.data)
                // set page
                setPage(data?.data?.current_page)
                setPerPage(data?.data?.per_page)
                setTotalRecords(data?.data?.total)
                setLastPage(data?.data?.last_page)
                setPageLinks(data?.data?.links)
                setCount(data?.data?.data.length || 0)

                setStatus('')   // ('success')
                setMessage('')  // ('Panels fetched successfully')
            } else {
                setStatus('error')
                setMessage(data.message)
            }
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setStatus('error')
            setMessage('Error fetching panels: ' + err.message || err)
            setLoading(false)
        })
    }


    useEffect(() => {
        let mounted = true
        if (mounted) {
            let prg = 'program/' + prog
            fetchProgram(prg)

            let rsc = 'panels?program=' + prog+'&page='+page
            fetchPanels(rsc)
        }
        return () => mounted = false
    }, [prog,page])


    if (loading) return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </main>
    return (
        <>
            <Head>
                <title>EPT | Panels</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='container p-0'>
                <div className="row">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                        <div className="d-flex w-100 flex-row flex-wrap justify-content-center justify-content-lg-between align-items-center gap-lg-4">
                            <button className="btn btn-link btn-sm" onClick={() => router.back()}>&larr; Back</button>
                            <ProgramsNavbar program={programData} router={router} subtitle="Panels" />
                            <Link href="/admin/programs/[program]/panels/new" as={`/admin/programs/${prog}/panels/new`}>
                                <a className="btn btn-primary btn-sm">
                                    <i className='fa fa-plus'></i> &nbsp;
                                    New Panel
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
                <hr />
                <div className='row'>
                    <div className='col-12'>
                        {status && status !== '' && <div className={`alert d-flex align-items-center gap-3 alert-${status === 'error' ? 'danger' : 'success'}`} role="alert">
                            <i className={'fa fa-2x fa-' + (status === 'error' ? 'warning' : 'info-circle')}></i> {message}
                        </div>}
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="d-flex w-100">
                            <div className="table-responsive w-100">
                                <table className="table table-striped table-hover table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Created At</th>
                                            <th scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {panels && panels.length > 0 ? panels.map((panel) => (

                                            <tr key={panel.uuid}>
                                                <td>
                                                    <Link href={`/admin/programs/${prog}/panels/${panel.uuid}`}>
                                                        <a className="">{panel.name}</a>
                                                    </Link>
                                                </td>
                                                <td>
                                                    {panel?.description}
                                                </td>
                                                <td className='text-capitalize'>{panel.deleted_at == null ? <span className='badge bg-success'>Active</span> : <span className='badge bg-warning'>Disabled</span>}</td>
                                                <td>{new Date(panel?.created_at).toLocaleString('en-GB', {
                                                    year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
                                                }) || "-"}</td>
                                                <td className="d-flex flex-column flex-lg-row gap-2 justify-content-center">
                                                    <Link href={{ pathname: `/admin/programs/${prog}/panels/${panel.uuid}/edit` }} >
                                                        <a className='btn btn-primary btn-sm py-0 text-nowrap'>Edit</a>
                                                    </Link>
                                                    <a className='btn text-danger btn-link btn-sm py-0 text-nowrap' onClick={ev => {
                                                        ev.preventDefault();
                                                        ev.stopPropagation();
                                                        if (confirm('Are you sure you want to delete this panel?')) {
                                                            getResource(`panel/delete/${panel.uuid}`, { method: 'DELETE' }).then((data) => {
                                                                if (data.status === true) {
                                                                    setStatus('success')
                                                                    setMessage('Panel deleted successfully')
                                                                    setPanels(panels.filter(u => u.uuid !== panel.uuid))
                                                                } else {
                                                                    setStatus('error')
                                                                    setMessage(data.message)
                                                                }
                                                            }).catch((err) => {
                                                                console.log(err)
                                                                setStatus('error')
                                                                setMessage('Error deleting panel: ' + err.message || err)
                                                            })
                                                        }
                                                    }}>Delete</a>
                                                </td>
                                            </tr>
                                        )) : <tr><td colSpan={7} className="text-center">No panels found</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* pagination */}
                    <Pagination
                        page={page}
                        lastPage={lastPage}
                        totalRecords={totalRecords}
                        count={count}
                        perPage={perPage}
                        pageLinks={pageLinks}
                        setPage={setPage}
                    />
                </div>
            </div>
        </>
    )
}

export default Panels