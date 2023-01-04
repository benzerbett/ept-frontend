import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { getResource } from '../../../utilities';

function NewProgram() {

    const router = useRouter()

    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);

    const [programData, setProgramData] = useState({
        "name": "",
        "description": "",
        "meta": {}
    })

    const periodTypes = [
        {
            "frequencyOrder": 1,
            "code": "Daily",
            "label": "Daily",
            "isoDuration": "P1D",
            "isoFormat": "yyyyMMdd"
        },
        {
            "frequencyOrder": 7,
            "code": "Weekly",
            "label": "Weekly",
            "isoDuration": "P7D",
            "isoFormat": "yyyyWn"
        },
        {
            "frequencyOrder": 7,
            "code": "WeeklyWednesday",
            "label": "Weekly starting Wednesday",
            "isoDuration": "P7D",
            "isoFormat": "yyyyWedWn"
        },
        {
            "frequencyOrder": 7,
            "code": "WeeklyThursday",
            "label": "Weekly starting Thursday",
            "isoDuration": "P7D",
            "isoFormat": "yyyyThuWn"
        },
        {
            "frequencyOrder": 7,
            "code": "WeeklySaturday",
            "label": "Weekly starting Saturday",
            "isoDuration": "P7D",
            "isoFormat": "yyyySatWn"
        },
        {
            "frequencyOrder": 7,
            "code": "WeeklySunday",
            "label": "Weekly starting Sunday",
            "isoDuration": "P7D",
            "isoFormat": "yyyySunWn"
        },
        {
            "frequencyOrder": 14,
            "code": "BiWeekly",
            "label": "Biweekly (every 2 weeks)",
            "isoDuration": "P14D",
            "isoFormat": "yyyyBiWn"
        },
        {
            "frequencyOrder": 30,
            "code": "Monthly",
            "label": "Monthly (every month)",
            "isoDuration": "P1M",
            "isoFormat": "yyyyMM"
        },
        {
            "frequencyOrder": 61,
            "code": "BiMonthly",
            "label": "Bi-monthly (every 2 months)",
            "isoDuration": "P2M",
            "isoFormat": "yyyyMMB"
        },
        {
            "frequencyOrder": 91,
            "code": "Quarterly",
            "label": "Quarterly (every 3 months)",
            "isoDuration": "P3M",
            "isoFormat": "yyyyQn"
        },
        {
            "frequencyOrder": 182,
            "code": "SixMonthly",
            "label": "Six-monthly (every 6 months)",
            "isoDuration": "P6M",
            "isoFormat": "yyyySn"
        },
        {
            "frequencyOrder": 182,
            "code": "SixMonthlyApril",
            "label": "Six-monthly starting April",
            "isoDuration": "P6M",
            "isoFormat": "yyyyAprilSn"
        },
        {
            "frequencyOrder": 365,
            "code": "Yearly",
            "label": "Yearly",
            "isoDuration": "P1Y",
            "isoFormat": "yyyy"
        },
        {
            "frequencyOrder": 365,
            "code": "FinancialApril",
            "label": "Financial year starting April",
            "isoDuration": "P1Y",
            "isoFormat": "yyyyApril"
        },
        {
            "frequencyOrder": 365,
            "code": "FinancialJuly",
            "label": "Financial year starting July",
            "isoDuration": "P1Y",
            "isoFormat": "yyyyJuly"
        },
        {
            "frequencyOrder": 365,
            "code": "FinancialOct",
            "label": "Financial year starting October",
            "isoDuration": "P1Y",
            "isoFormat": "yyyyOct"
        }
    ];

    const saveProgram = () => {
        setLoading(true)
        getResource('program/new', { method: 'POST', body: programData }).then((data) => {
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
            setMessage('Error saving program: ' + err.message || err)
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
                <title>EPT | New Program</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='container'>
                <div className="row mb-4 ">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                        <div className="d-flex w-100 flex-row flex-wrap justify-content-center justify-content-lg-between align-items-center gap-lg-4">
                            <button className="btn btn-link btn-sm" onClick={() => router.back()}>&larr; Back</button>
                            <h3>New program</h3>
                            <Link href="/admin/programs" as={`/admin/programs`}>
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
                        <form onSubmit={ev => {
                            ev.preventDefault()
                            saveProgram()
                        }}>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="program_name">Program Name
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <input type="text" className="form-control" id="program_name" value={programData.name} placeholder="Enter program name" onChange={ev => {
                                        setProgramData({ ...programData, name: ev.target.value })
                                    }} />
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="program_desc">Program Description</label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <textarea className="form-control" id="program_desc" value={programData.description} placeholder="Describe the program" onChange={ev => {
                                        setProgramData({ ...programData, description: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="program_calendar">Program Calendar
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <select className='form-select' id="program_calendar" value={programData.calendar} onChange={ev => {
                                        setProgramData({ ...programData, calendar: ev.target.value })
                                    }}>
                                        <option value="">Select Calendar</option>
                                        {periodTypes.map((periodType, index) => {
                                            return (
                                                <option key={index} value={periodType.code}>{periodType.label}</option>
                                            )
                                        })}
                                        <option value="custom">Custom</option>
                                    </select>
                                </div>
                            </div>
                            {(programData?.calendar && programData?.calendar === 'custom') && <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="program_custom_cal">Custom Program Calendar</label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <p>Every <select className='form-select form-select-sm w-auto d-inline-flex'>
                                        <option value="1">first</option> <option value="2">second</option> <option value="3">third</option> <option value="4">fourth</option>
                                    </select> <select className='form-select form-select-sm w-auto d-inline-flex'>
                                            <option value="1">Day</option> <option value="2">Week</option> <option value="3">Month</option> <option value="4">Year</option>
                                        </select> of <select className='form-select form-select-sm w-auto d-inline-flex'>
                                            <option value="1">January</option> <option value="2">February</option> <option value="3">March</option> <option value="4">April</option> <option value="5">May</option> <option value="6">June</option> <option value="7">July</option> <option value="8">August</option> <option value="9">September</option> <option value="10">October</option> <option value="11">November</option> <option value="12">December</option>
                                        </select></p>
                                </div>
                            </div>}
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="program_meta">Participant target type
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <select className='form-select'>
                                        <option value="">Select</option>
                                        <option value="individual">Individual</option>
                                        <option value="laboratory">Laboratory</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="program_meta">Participant laboratory</label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <select>
                                        <option value="">Select</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="program_meta">Program Metadata</label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <textarea className="form-control" id="program_meta" placeholder="Additional attributes" onChange={ev => {
                                        setProgramData({ ...programData, meta: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>
                            <div className="w-100 d-flex align-items-center justify-content-center">
                                <button type="submit" className="btn btn-primary">Save program</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewProgram