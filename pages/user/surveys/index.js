import Head from 'next/head'
import React from 'react'
import Link from 'next/link'
import { simulateGetSession } from '../../../utilities'

function Surveys() {
    const [surveys, setSurveys] = React.useState([])
    const [activeconfig, setActiveConfig] = React.useState(null)

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
            const ap = getProgramConfig(session.activeProgramCode)
            ap.then((data) => {
                setActiveConfig(data)
                setSurveys(data.surveys)
            } )
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
                                {surveys.map((survey) => (
                                    <tr key={survey.id}>
                                        <td>
                                            <a href={`/user/surveys/${survey.id}`}>{survey.title}</a>
                                        </td>
                                        <td className='text-capitalize'>{survey.status == 'open' ? <span className='badge bg-success'>Open</span>: survey.status}</td>
                                        <td>{new Date(survey.created_at).toDateString('en-GB')}</td>
                                        <td>{new Date(survey.due_date).toDateString('en-GB')}</td>
                                        <td>No</td>
                                        <td className="d-flex flex-column flex-md-row gap-2 justify-content-center">
                                            <Link href={{
                                                  pathname: `/user/surveys/${survey.id}/new`,
                                                  query: {pID:survey.code,fID:survey.form},
                                                }}
                                            > 
                                            <a className='btn btn-primary btn-sm py-0 text-nowrap'>Take Survey</a></Link>
                                            <Link href={{
                                                  pathname: `/user/surveys/${survey.id}/edit`,
                                                  query: {pID:survey.code,fID:survey.form},
                                                }}
                                            > 
                                            <a className='btn btn-dark btn-sm py-0 text-nowrap'>Edit Survey</a></Link>
                                            {/* <a className='btn btn-dark btn-sm py-0 text-nowrap' href={`/user/surveys/${survey.id}`}> Preview form</a> */}
                                        </td>
                                      
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Surveys