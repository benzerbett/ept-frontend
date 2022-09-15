import Head from 'next/head'
import React from 'react'
import Link from 'next/link'

function Surveys() {
    const surveys = [
        {
            id: 1,
            code: 'SARS-CoV-2-PT',
            form:'SARS-CoV-2-PT-RA-survey',
            title: 'Covid Survey',
            description: 'Oncology PT Round 9 Readiness Survey',
            status: 'open',
            created_at: '2022-08-01T00:00:00.000Z',
            updated_at: '2022-08-01T00:00:00.000Z',
            due_date: '2022-08-01T00:00:00.000Z'
        },
        {
            id: 2,
            code: 'oncology-PT',
            form:'Oncology-PT-RA-Aug22',
            title: 'Oncology Survey',
            description: 'Oncology PT Round 9 Readiness Survey',
            status: 'open',
            created_at: '2022-08-01T00:00:00.000Z',
            updated_at: '2022-08-01T00:00:00.000Z',
            due_date: '2022-08-01T00:00:00.000Z'
        },
        {
            id: 3,
            code: 'Microbiology-PT',
            form:'Microbiology-PT-RA-Aug22',
            title: 'Microbiology Survey',
            description: 'Oncology PT Round 9 Readiness Survey',
            status: 'open',
            created_at: '2022-08-01T00:00:00.000Z',
            updated_at: '2022-08-01T00:00:00.000Z',
            due_date: '2022-08-01T00:00:00.000Z'
        }
    ]

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