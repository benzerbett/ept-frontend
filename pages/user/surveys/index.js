import Head from 'next/head'
import React from 'react'
import Link from 'next/link'
import { simulateGetSession } from '../../../utilities'
import { useRouter } from 'next/router'

function Surveys() {
    const [surveys, setSurveys] = React.useState([])
    const [session, setSession] = React.useState([])
    const [activeconfig, setActiveConfig] = React.useState(null)
    const router = useRouter()

    const getProgramConfig = (id) => {
        return fetch(`/api/configurations/${id}`)
            .then((res) => res.json())
            .then((data) => {
                return data
            })
    }

    React.useEffect(() => {
        const session = simulateGetSession();
        if (session) {
            setSession(session)
            if (session && session.activeProgramCode) {
                const ap = getProgramConfig(session.activeProgramCode)
                ap.then((data) => {
                    setActiveConfig(data)
                    let svys = []
                    data.rounds.map(round => {
                        if (round.useChecklist) {
                            svys = Array.from([...svys, data.forms.find(f => f.code == round.checklistForm)], fm => {
                                return {
                                    code: fm.code,
                                    name: fm.name,
                                    description: fm.description,
                                    metadata: fm.metadata,
                                }
                            })
                        }
                    })
                    setSurveys(svys)
                })
            } else {
                router.push('/user')
            }
        }
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
                                    <tr key={survey.code}>
                                        <td>
                                            <a href={`/user/surveys/${survey.code}`}>{survey.name}</a>
                                        </td>
                                        <td className='text-capitalize'>{survey.status == 'open' ? <span className='badge bg-success'>Open</span> : (survey.status || "-")}</td>
                                        <td>{ new Date(survey.metadata.created).toDateString('en-GB') || "-"}</td>
                                        <td>{ new Date(survey.metadata.due_date).toDateString('en-GB') || "-"}</td>
                                        <td>No</td>
                                        <td className="d-flex flex-column flex-md-row gap-2 justify-content-center">
                                            <Link href={{
                                                pathname: `/user/surveys/${survey.code}/new`,
                                            }}>
                                                <a className='btn btn-primary btn-sm py-0 text-nowrap'>Take Survey</a>
                                            </Link>
                                            {/* TODO: or edit */}
                                            {/* <Link href={{
                                                pathname: `/user/surveys/${survey.code}/edit/${session.user?.id}`,
                                            }}
                                            >
                                                <a className='btn btn-dark btn-sm py-0 text-nowrap'>Edit Survey Submission</a>
                                            </Link> */}
                                        </td>

                                    </tr>
                                )) : <tr><td colSpan="6" className="text-center">No surveys found</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Surveys