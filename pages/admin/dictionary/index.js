import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Pagination from '../../../components/common/Pagination'
import { doGetSession, getResource } from '../../../utilities'

function Dictionary() {
    const [dictionary, setDictionary] = useState([])

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

    const fetchDictionary = (resource) => {
        getResource(resource).then((data) => {
            if (data.status === true) {
                setDictionary(data?.data?.data)
                // set page
                setPage(data?.data?.current_page)
                setPerPage(data?.data?.per_page)
                setTotalRecords(data?.data?.total)
                setLastPage(data?.data?.last_page)
                setPageLinks(data?.data?.links)
                setCount(data?.data?.data.length || 0)

                setStatus('')   // ('success')
                setMessage('')  // ('Dictionary fetched successfully')
            } else {
                setStatus('error')
                setMessage(data.message)
            }
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setStatus('error')
            setMessage('Error fetching dictionary: ' + err.message || err)
            setLoading(false)
        })
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            let rsc = 'dictionary?page=' + page
            fetchDictionary(rsc)
            setIsSearch(false)
        }
        return () => mounted = false
    }, [page])


    if (loading) return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </main>

    return (
        <>
            <Head>
                <title>EPT | Dictionary</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="container">
                <div className="row">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                        <h2 className="font-bold my-4">Permissions</h2>
                        {isSearch && <span>
                            Showing search results for '<strong>{search}</strong>' <button className="btn btn-link text-danger" onClick={() => { setSearch(''); setIsSearch(false); fetchDictionary('dictionary?page=' + page) }}>Clear</button>
                        </span>}
                        {/* TODO: add program filter */}
                        <div className="d-flex align-items-center my-2">
                            <form className="input-group">
                                <input type="text" className="form-control" value={search} placeholder="Search" onChange={ev => {
                                    setSearch(ev.target.value)
                                }} />
                                <button className="btn btn-primary bg-dark" onClick={ev => {
                                    ev.preventDefault();
                                    if (search && search !== '' && search !== null && search.length > 2) {
                                        fetchDictionary('dictionary?search=' + search)
                                        setIsSearch(true)
                                    }
                                }}>Search</button>
                            </form>
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
                                            <th scope="col">Status</th>
                                            <th scope="col">Created At</th>
                                            <th scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dictionary && dictionary.length > 0 ? dictionary.map((dictionary) => (

                                            <tr key={dictionary.uuid}>
                                                <td>
                                                    <Link href={`/admin/dictionary/${dictionary.uuid}`}>
                                                        <a className="">{dictionary.name}</a>
                                                    </Link>
                                                </td>
                                                <td>
                                                    {dictionary?.description}
                                                </td>
                                                <td className='text-capitalize'>{dictionary.deleted_at == null ? <span className='badge bg-success'>Active</span> : <span className='badge bg-warning'>Disabled</span>}</td>
                                                <td>{new Date(dictionary?.created_at).toLocaleString('en-GB', {
                                                    year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
                                                }) || "-"}</td>
                                                <td className="d-flex flex-column flex-lg-row gap-2 justify-content-center">
                                                    <Link href={{ pathname: `/dictionary/${dictionary.uuid}/edit` }} >
                                                        <a className='btn btn-primary btn-sm py-0 text-nowrap'>Edit Dictionary</a>
                                                    </Link>
                                                    <a className='btn text-danger btn-link btn-sm py-0 text-nowrap' onClick={ev => {
                                                        ev.preventDefault();
                                                        ev.stopPropagation();
                                                        if (confirm('Are you sure you want to delete this dictionary?')) {
                                                            getResource(`dictionary/delete/${dictionary.uuid}`, { uuid: dictionary.uuid }).then((data) => {
                                                                if (data.status === true) {
                                                                    setStatus('success')
                                                                    setMessage('Dictionary deleted successfully')
                                                                    setDictionary(dictionary.filter(u => u.uuid !== dictionary.uuid))
                                                                } else {
                                                                    setStatus('error')
                                                                    setMessage(data.message)
                                                                }
                                                            }).catch((err) => {
                                                                console.log(err)
                                                                setStatus('error')
                                                                setMessage('Error deleting dictionary: ' + err.message || err)
                                                            })
                                                        }
                                                    }}>Delete Dictionary</a>
                                                </td>
                                            </tr>
                                        )) : <tr><td colSpan={7} className="text-center">No dictionary entries found</td></tr>}
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

export default Dictionary