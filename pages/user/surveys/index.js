import Head from 'next/head'
import React from 'react'
import Link from 'next/link'
import { doGetSession, getProgramConfig } from '../../../utilities'
import { useRouter } from 'next/router'

function Surveys() {
    const [surveys, setSurveys] = React.useState([])
    const [session, setSession] = React.useState([])
    const [activeconfig, setActiveConfig] = React.useState(null)
    const router = useRouter()


    React.useEffect(() => {
        doGetSession().then((session) => {
            if (session) {
                setSession(session)
                if (session && session.activeProgramCode) {
                    console.log('session.activeProgramCode', session.activeProgramCode)
                    const ap = getProgramConfig(session.activeProgramCode)
                    ap.then((data) => {
                        setActiveConfig(data)
                        let svys = Array.from(data?.data.rounds, round => {
                            if (round.active) {
                                return round.forms.find(f => ['pre','post'].includes(f.type))
                            }
                        })
                        setSurveys(svys)
                        // data?.data.rounds.map(round => {
                        //     if (round?.active) {
                        //         // TODO: update to match new form structure i.e. (round.forms.find(f => ['checklist','survey'].includes(f.type))) ))
                        //         // TODO: handle pre/post surveys. For post surveys, we need to check if the user has completed the evaluation
                        //         let f_ms = round.forms.find(f => (f.type == "pre" || f.type == "post"))
                        //         setSurveys(f_ms)
                        //     }
                        // })
                    })
                } else {
                    router.push('/user')
                }
            } else {
                router.push('/auth/login', undefined, { unstable_skipClientCache: true })
            }
        })
    }, [])

    return (
        <>
            <Head>
                <title>Surveys</title>
            </Head>
            <div className="container">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <h1 className="font-bold my-4">Surveys</h1>
                    <div className="d-flex align-items-center my-2">
                        <form className="input-group">
                            <input type="text" className="form-control" placeholder="Search" />
                            <button className="btn btn-dark"><i className='fa fa-search'></i></button>
                        </form>
                    </div>
                </div>
                    {/* {<pre>{JSON.stringify(surveys,null,2)}</pre>} */}
                <div className="d-flex w-100">
                    <div className="table-responsive w-100">
                        <table className="table table-striped table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">Title</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Start Date</th>
                                    <th scope="col">End Date</th>
                                    <th scope="col">Submitted?</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(surveys && surveys.length > 0) ? surveys.map((survey) => (
                                    <tr key={survey.uuid}>
                                        <td>
                                            {survey.name}
                                            {/* <Link href={`/user/surveys/${survey.uuid}`}><a>{survey.name}</a></Link> */}
                                        </td>
                                        <td className='text-capitalize'>
                                            {(survey.active == '1' || survey.active == true) ? <span className='badge bg-success'>Active</span> : (survey?.active || "-")}
                                        </td>
                                        <td>{new Date(survey.start_date).toDateString() || "-"}</td>
                                        <td>{new Date(survey.end_date).toDateString() || "-"}</td>
                                        <td>No</td> {/*TODO: check submissions*/}
                                        <td className="d-flex flex-column flex-md-row gap-2 justify-content-center">
                                            <Link href={{
                                                pathname: `/user/surveys/${survey.uuid}/new`,
                                            }}>
                                                <a className='btn btn-primary btn-sm text-nowrap'>Take Survey</a>
                                            </Link>
                                            {/* TODO: take or edit */}
                                            {/* <Link href={{
                                                pathname: `/user/surveys/${survey.uuid}/edit/${session.user?.id}`,
                                            }}
                                            >
                                                <a className='btn btn-dark btn-sm py-0 text-nowrap'>Edit Survey Submission</a>
                                            </Link> */}
                                        </td>

                                    </tr>
                                )) : <tr><td colSpan={6} className="text-center">No surveys found. {surveys.length}</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Surveys