import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { getResource } from '../../../utilities';

function NewOrgUnitLevel() {
    const router = useRouter()
    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);
    const [parentOrgUnits, setParentOrgUnits] = useState(null);

    const [org_unit_levels, setOrgUnitLevels] = useState([])

    const [ouLevelData, setOrgUnitLevelData] = useState({
        "name": "",
        "description": "",
        "level": "",
        "meta": {}
    })

    const saveOrgUnit = () => {
        setLoading(true)
        getResource('organization_unit_level/new', { method: 'POST', body: ouLevelData }).then((data) => {
            if (data.status === true) {
                setStatus('success')
                setMessage(data.message)
            } else {
                setStatus('error')
                setMessage(data.message)
            }
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setStatus('error')
            setMessage('Error saving organization unit level: ' + err.message || err)
            setLoading(false)
        })
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            setStatus('')
            setMessage('')
            setLoading(false)
        }
        return () => mounted = false
    }, [])

    if (loading) return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </main>

    return (
        <>
            <Head>
                <title>EPT | New Organization Unit</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='container'>
                <div className="row mb-4 ">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                        <div className="d-flex w-100 flex-row flex-wrap justify-content-center justify-content-lg-between align-items-center gap-lg-4">
                            <button className="btn btn-link btn-sm" onClick={() => router.back()}>&larr; Back</button>
                            <h3>New organization unit level</h3>
                            <Link href="/admin/roles" as={`/admin/roles`}>
                                <a className="btn btn-default text-muted btn-sm"> Cancel </a>
                            </Link>
                        </div>
                    </div>
                </div>
                {/* <div className='row'>
                    <div className='col-md-12'>
                        {JSON.stringify(ouLevelData)}
                    </div>
                </div> */}

                <div className='row'>
                    <div className='col-12'>
                        {status && status !== '' && <div className={`alert d-flex align-items-center gap-3 alert-${status === 'error' ? 'danger' : 'success'}`} role="alert">
                            <i className={'fa fa-2x fa-' + (status === 'error' ? 'warning' : 'info-circle')}></i> {message}
                        </div>}
                    </div>
                </div>
                <div className="row bg-light p-3 rounded">
                    <div className='col-lg-12 my-3'>
                        <form onSubmit={ev => {
                            ev.preventDefault()
                            saveOrgUnit()
                        }}>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1'>
                                    <label className='form-label' htmlFor="orgunit_name">Level Name
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm mb-1'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8'>
                                    <input type="text" className="form-control" id="orgunit_name" value={ouLevelData.name} placeholder="Enter level name" onChange={ev => {
                                        setOrgUnitLevelData({ ...ouLevelData, name: ev.target.value })
                                    }} />
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1'>
                                    <label className='form-label' htmlFor="orgunit_desc">OrgUnit Description</label>
                                    <small className='d-block text-muted lh-sm mb-1'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8'>
                                    <textarea className="form-control" id="orgunit_desc" value={ouLevelData.description} placeholder="Describe the level" onChange={ev => {
                                        setOrgUnitLevelData({ ...ouLevelData, description: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1'>
                                    <label className='form-label' htmlFor="orgunit_desc">Level</label>
                                    <small className='d-block text-muted lh-sm mb-1'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8'>
                                    <select className='form-select' onChange={ev => {
                                        setOrgUnitLevelData({ ...ouLevelData, level: ev.target.value })
                                    }}>
                                        <option value=''>Select Level</option>
                                        {[0,1,2,3,4,5,6].map((lvl, index) => {
                                            return <option key={lvl} value={lvl}>{lvl}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1'>
                                    <label className='form-label' htmlFor="orgunit_meta">Metadata</label>
                                    <small className='d-block text-muted lh-sm mb-1'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8'>
                                    <textarea className="form-control" id="orgunit_meta" placeholder="Additional attributes" onChange={ev => {
                                        setOrgUnitLevelData({ ...ouLevelData, meta: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>
                            <div className="w-100 d-flex align-items-center justify-content-center">
                                <button type="submit" className="btn btn-primary">Save level</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewOrgUnitLevel