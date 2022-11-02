import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Pagination from '../../../components/common/Pagination'
import { doGetSession, getResource } from '../../../utilities'

function OrgUnits() {
    const [orgunits, setOrgUnits] = useState([])

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
    const router = useRouter()

    const fetchOrgUnits = (resource) => {
        getResource(resource).then((data) => {
            if (data.status === true) {
                setOrgUnits(data?.data?.data)
                // set page
                setPage(data?.data?.current_page)
                setPerPage(data?.data?.per_page)
                setTotalRecords(data?.data?.total)
                setLastPage(data?.data?.last_page)
                setPageLinks(data?.data?.links)
                setCount(data?.data?.data.length || 0)

                setStatus('')   // ('success')
                setMessage('')  // ('OrgUnits fetched successfully')
            } else {
                setStatus('error')
                setMessage(data.message)
            }
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setStatus('error')
            setMessage('Error fetching orgunits: ' + err.message || err)
            setLoading(false)
        })
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            let rsc = 'organization_units?page=' + page
            fetchOrgUnits(rsc)
            setIsSearch(false)
        }
        return () => mounted = false
    }, [page])


    if (loading) return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </main>

    // return (
    //     <main>
    //         <Head>
    //             <title>OrgUnits</title>
    //         </Head>
    //         <div className="container">
    //             <pre>{JSON.stringify(orgunits, null, 2)}</pre>
    //         </div>
    //     </main>
    // )
    return (
        <>
            <Head>
                <title>EPT | Organization Units</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
                <meta charSet="utf-8" />
            </Head>
            <div className="container">
                <div className="row">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                        <h2 className="font-bold my-4">Organization Units</h2>
                        {isSearch && <span>
                            Showing search results for '<strong>{search}</strong>' <button className="btn btn-link text-danger" onClick={() => { setSearch(''); setIsSearch(false); fetchOrgUnits('orgunits?page=' + page) }}>Clear</button>
                        </span>}
                        <div className="d-flex align-items-center my-2 flex-wrap gap-3">
                            <div className="d-flex align-items-center my-2 flex-wrap">
                                <form className="input-group">
                                    <input type="text" className="form-control" value={search} placeholder="Search" onChange={ev => {
                                        setSearch(ev.target.value)
                                    }} />
                                    <button className="btn btn-primary bg-dark" onClick={ev => {
                                        ev.preventDefault();
                                        if (search && search !== '' && search !== null && search.length > 2) {
                                            fetchOrgUnits('organization_units?search=' + search)
                                            setIsSearch(true)
                                        }
                                    }}><i className='fa fa-search'></i></button>
                                </form>
                            </div>
                            <Link href='/admin/orgunits/new'>
                                <a className='btn btn-primary'> <i className='fa fa-plus'></i> &nbsp; Add New </a>
                            </Link>
                        </div>
                    </div>
                </div>
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
                                            <th scope="col">Level</th>
                                            <th scope="col">Parent</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Created At</th>
                                            {/* <th scope="col">Actions</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orgunits && orgunits.length > 0 ? orgunits.map((orgunit) => (

                                            <tr key={orgunit.uuid}>
                                                <td>
                                                    <Link href={`/admin/orgunits/${orgunit.uuid}`}>
                                                        <a className="">{orgunit.name}</a>
                                                    </Link>
                                                </td>
                                                <td>
                                                    {orgunit?.description}
                                                </td>
                                                <td>
                                                    {orgunit?.level}
                                                </td>
                                                <td>
                                                    {orgunit?.parent?.name || '-'}
                                                </td>
                                                <td className='text-capitalize'>{orgunit.deleted_at == null ? <span className='badge bg-success'>Active</span> : <span className='badge bg-warning'>Disabled</span>}</td>
                                                <td>{new Date(orgunit?.created_at).toLocaleString('en-GB', {
                                                    year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
                                                }) || "-"}</td>
                                                <td className="d-flex flex-column flex-lg-row gap-2 justify-content-center">
                                                    <Link href={{ pathname: `/admin/orgunits/${orgunit.uuid}/edit` }} >
                                                        <a className='btn btn-primary btn-sm py-0 text-nowrap'>Edit</a>
                                                    </Link>
                                                    <a className='btn text-danger btn-link btn-sm py-0 text-nowrap' onClick={ev => {
                                                        ev.preventDefault();
                                                        ev.stopPropagation();
                                                        if (confirm('Are you sure you want to delete this orgunit?')) {
                                                            getResource(`organization_unit/delete/${orgunit.uuid}`, { method: 'DELETE' }).then((data) => {
                                                                if (data.status === true) {
                                                                    setStatus('success')
                                                                    setMessage('OrgUnit deleted successfully')
                                                                    setOrgUnits(orgunits.filter(u => u.uuid !== orgunit.uuid))
                                                                } else {
                                                                    setStatus('error')
                                                                    setMessage(data.message)
                                                                }
                                                            }).catch((err) => {
                                                                console.log(err)
                                                                setStatus('error')
                                                                setMessage('Error deleting orgunit: ' + err.message || err)
                                                            })
                                                        }
                                                    }}>Delete</a>
                                                </td>
                                            </tr>
                                        )) : <tr><td colSpan={7} className="text-center">No orgunits found</td></tr>}
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

export default OrgUnits