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
                    const ap = getProgramConfig(session.activeProgramCode)
                    ap.then((data) => {
                        setActiveConfig(data)
                        let svys = []
                        data.rounds.map(round => {
                            if (round?.active && round.useChecklist) {
                                let f_m = data.forms.find(f => f.uuid == round.checklistForm)
                                if (f_m) {
                                    // svys.push(f_m)
                                    svys = Array.from([...svys, f_m], fm => {
                                        return {
                                            round_name: round.name,
                                            uuid: fm.uuid,
                                            name: fm.name,
                                            description: fm.description,
                                            metadata: fm.metadata,
                                        }
                                    })
                                }
                            }
                        })
                        setSurveys(svys)
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
                            <button className="btn btn-primary">Search</button>
                        </form>
                    </div>
                </div>
                <div className="d-flex w-100">
                    {/* {<pre>{JSON.stringify(surveys,null,2)}</pre>} */}
                    <div className="table-responsive w-100">
                        <table className="table table-striped table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">Round</th>
                                    <th scope="col">Title</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Created At</th>
                                    <th scope="col">Due Date</th>
                                    <th scope="col">Submitted?</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {surveys && surveys.length > 0 ? surveys.map((survey) => (
                                    <tr key={survey.uuid}>
                                        <td>
                                            {survey.round_name}
                                            {/* <Link href={`/user/surveys/${survey.uuid}`}><a>{survey.name}</a></Link> */}
                                        </td>
                                        <td>
                                            {survey.name}
                                            {/* <Link href={`/user/surveys/${survey.uuid}`}><a>{survey.name}</a></Link> */}
                                        </td>
                                        <td className='text-capitalize'>{(survey.status == 'open' || survey.status == 'active') ? <span className='badge bg-success'>Open</span> : (survey.status || "-")}</td>
                                        <td>{new Date(survey.metadata.created).toDateString('en-GB') || "-"}</td>
                                        <td>{new Date(survey.metadata.due_date).toDateString('en-GB') || "-"}</td>
                                        <td>No</td>
                                        <td className="d-flex flex-column flex-md-row gap-2 justify-content-center">
                                            <Link href={{
                                                pathname: `/user/surveys/${survey.uuid}/new`,
                                            }}>
                                                <a className='btn btn-primary btn-sm py-0 text-nowrap'>Take Survey</a>
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
                                )) : <tr><td colSpan={8} className="text-center">No surveys found</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Surveys