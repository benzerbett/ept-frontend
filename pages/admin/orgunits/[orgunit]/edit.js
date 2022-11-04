import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { getResource } from '../../../../utilities';

function EditOrgUnit() {
    const router = useRouter()
    const { orgunit } = router.query
    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);
    
    const [parentOrgUnits, setParentOrgUnits] = useState(null);
    const [orgUnitLevels, setOrgUnitLevels] = useState([])
    const [newOrgUnitData, setNewOrgUnitData] = useState({
        "name": "",
        "description": "",
        "level": "",
        "parent": "",
        "meta": ""
    })

    const fetchOrgUnitLevels = () => {
        // setLoading(true)
        getResource('organization_unit_levels?page_size=10000').then((data) => {
            if (data.status === true) {
                setOrgUnitLevels(data?.data?.data)
                setStatus('')
                setMessage('')
            } else {
                setStatus('error')
                setMessage(data.message)
            }
            // setLoading(false)
        }).catch((err) => {
            console.log(err)
            setStatus('error')
            setMessage('Error fetching organization unit levels: ' + err.message || err)
            // setLoading(false)
        })
    }
    
    const fetchOrgUnits = (lvl) => {
        // setLoading(true)
        getResource('organization_units?page_size=10000&level_code='+lvl).then((data) => {
            if (data.status === true) {
                setParentOrgUnits(data?.data?.data)
                setStatus('')
                setMessage('')
            } else {
                setStatus('error')
                setMessage(data.message)
            }
            // setLoading(false)
        }).catch((err) => {
            console.log(err)
            setStatus('error')
            setMessage('Error fetching organization unit levels: ' + err.message || err)
            // setLoading(false)
        })
    }

    const saveOrgUnit = () => {
        setLoading(true)
        getResource('organization_unit/edit/' + orgunit, { method: 'PUT', body: newOrgUnitData }).then((data) => {
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
            setMessage('Error saving org_unit: ' + err.message || err)
            setLoading(false)
        })
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            setStatus('')
            setMessage('')
            setLoading(false)
            fetchOrgUnitLevels()
            // get org_unit
            getResource(`organization_unit/${orgunit}`).then((data) => {
                if (data.status === true) {
                    setNewOrgUnitData({
                        "name": data.data.name || "",
                        "description": data.data.description || "",
                        "level": typeof data.data.level == 'object' ? data.data.level.uuid : data.data.level || "",
                        "parent": typeof data.data.parent == 'object' ? data.data.parent.uuid : data.data.parent || "",
                        "meta": data.data.meta || ""
                    })
                    // fetch parent org_units
                    fetchOrgUnits(data.data.level -1 || 0)
                } else {
                    setStatus('error')
                    setMessage(data.message)
                }
                setLoading(false)
            }).catch((err) => {
                console.log(err)
                setStatus('error')
                setMessage('Error loading organization unit: ' + err.message || err)
                setLoading(false)
            })
        }
        return () => mounted = false
    }, [])

    if (loading) return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </main>

    return (
        <>
            <Head>
                <title>EPT | Edit Organization Unit</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='container'>
                <div className="row mb-4 ">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                        <div className="d-flex w-100 flex-row flex-wrap justify-content-center justify-content-lg-between align-items-center gap-lg-4">
                            <button className="btn btn-link btn-sm" onClick={() => router.back()}>&larr; Back</button>
                            <h3>Edit organization unit</h3>
                            <Link href="/admin/orgunits" as={`/admin/orgunits`}>
                                <a className="btn btn-default text-muted btn-sm"> Cancel </a>
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
                <div className="row bg-light p-3 rounded">
                    <div className='col-lg-12 my-3'>
                        {status !== 'error' && <form onSubmit={ev => {
                            ev.preventDefault()
                            saveOrgUnit()
                        }}>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1'>
                                    <label className='form-label' htmlFor="org_unit_name">Name
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm mb-1'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <input type="text" className="form-control" id="org_unit_name" defaultValue={newOrgUnitData.name} placeholder="Enter org_unit_level name" onChange={ev => {
                                        setNewOrgUnitData({ ...newOrgUnitData, name: ev.target.value })
                                    }} />
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1'>
                                    <label className='form-label' htmlFor="org_unit_level_desc">Description</label>
                                    <small className='d-block text-muted lh-sm mb-1'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <textarea className="form-control" id="org_unit_level_desc" defaultValue={newOrgUnitData.description} placeholder="Describe the org_unit_level" onChange={ev => {
                                        setNewOrgUnitData({ ...newOrgUnitData, description: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1'>
                                    <label className='form-label' htmlFor="orgunit_level">Level</label>
                                    <small className='d-block text-muted lh-sm mb-1'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <select className='form-select' name='orgunit_level' defaultValue={typeof newOrgUnitData.level == "object" ? newOrgUnitData.level.uuid : newOrgUnitData.level} onChange={ev => {
                                        setNewOrgUnitData({ ...newOrgUnitData, level: ev.target.value })
                                        setParentOrgUnits([])
                                        // fetch org units with level above selected level
                                        let selected_level_code = orgUnitLevels.find(l => l.uuid === ev.target.value)?.level
                                        if (selected_level_code && selected_level_code > 0) {
                                            fetchOrgUnits(selected_level_code - 1)
                                        }
                                    }}>
                                        <option value=''>Select Level</option>
                                        {orgUnitLevels.map((org_unit_level, index) => {
                                            return <option key={org_unit_level.uuid} value={org_unit_level.uuid}>{org_unit_level.name}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                            {parentOrgUnits && parentOrgUnits.length > 0 && <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1'>
                                    <label className='form-label' htmlFor="orgunit_parent">Parent</label>
                                    <small className='d-block text-muted lh-sm mb-1'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <select className='form-select' name='orgunit_parent' defaultValue={(newOrgUnitData.parent && typeof newOrgUnitData.parent == "object") ? newOrgUnitData.parent.uuid : newOrgUnitData.parent || null} onChange={ev => {
                                        setNewOrgUnitData({ ...newOrgUnitData, parent: ev.target.value })
                                    }}>
                                        <option value=''>Select Parent</option>
                                        {parentOrgUnits.map((org_unit, index) => {
                                            return <option key={org_unit.uuid} value={org_unit.uuid}>{org_unit.name}</option>
                                        })}
                                    </select>
                                </div>
                            </div>}
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1'>
                                    <label className='form-label' htmlFor="org_unit_level_meta">Metadata</label>
                                    <small className='d-block text-muted lh-sm mb-1'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <textarea className="form-control" id="org_unit_level_meta" placeholder="Additional attributes" defaultValue={typeof newOrgUnitData.meta == 'object' ? JSON.stringify(newOrgUnitData.meta) : newOrgUnitData.meta} onChange={ev => {
                                        setNewOrgUnitData({ ...newOrgUnitData, meta: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>
                            <div className="w-100 d-flex align-items-center justify-content-center">
                                <button type="submit" className="btn btn-primary">Update level</button>
                            </div>
                        </form>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditOrgUnit