import Head from 'next/head'
import React from 'react'
import Link from 'next/link'

function Evaluations() {
    const evaluations = [
        {
            id: 1,
            code: 'SARS-CoV-2-PT',
            form:'SARS-CoV-2-PT-RA-Aug22',
            title: 'Covid Evaluation ',
            description: 'Oncology PT Round 9 Readiness Evaluation',
            status: 'open',
            created_at: '2022-08-01T00:00:00.000Z',
            updated_at: '2022-08-01T00:00:00.000Z',
            due_date: '2022-08-01T00:00:00.000Z'
        },
        {
            id: 2,
            code: 'oncology-PT',
            form:'Oncology-PT-RA-Aug22',
            title: 'Oncology Evaluation ',
            description: 'Oncology PT Round 9 Readiness Evaluation',
            status: 'open',
            created_at: '2022-08-01T00:00:00.000Z',
            updated_at: '2022-08-01T00:00:00.000Z',
            due_date: '2022-08-01T00:00:00.000Z'
        },
        {
            id: 3,
            code: 'Microbiology-PT',
            form:'Microbiology-PT-RA-Aug22',
            title: 'Microbilogy Evaluation ',
            description: 'Oncology PT Round 9 Readiness Evaluation',
            status: 'open',
            created_at: '2022-08-01T00:00:00.000Z',
            updated_at: '2022-08-01T00:00:00.000Z',
            due_date: '2022-08-01T00:00:00.000Z'
        }
    ]

    return (
        <>
            <Head>
                <title>Evaluations</title>
            </Head>
            <div className="container">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <h1 className="font-bold my-4">Evaluations</h1>
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
                                {evaluations.map((evaluation) => (
                                    <tr key={evaluation.id}>
                                        <td>
                                            <a href={`/user/evaluations/${evaluation.id}`}>{evaluation.title}</a>
                                        </td>
                                        <td className='text-capitalize'>{evaluation.status == 'open' ? <span className='badge bg-success'>Open</span>: evaluation.status}</td>
                                        <td>{new Date(evaluation.created_at).toDateString('en-GB')}</td>
                                        <td>{new Date(evaluation.due_date).toDateString('en-GB')}</td>
                                        <td>No</td>
                                        <td className="d-flex flex-column flex-md-row gap-2 justify-content-center">
                                            <Link href={{
                                                  pathname: `/user/evaluations/${evaluation.id}/new`,
                                                  query: {pID:evaluation.code,fID:evaluation.form},
                                                }}
                                            > 
                                            <a className='btn btn-primary btn-sm py-0 text-nowrap'>Take Evaluation</a></Link>
                                            <Link href={{
                                                  pathname: `/user/evaluations/${evaluation.id}/new`,
                                                  query: {pID:evaluation.code,fID:evaluation.form},
                                                }}
                                            > 
                                            <a className='btn btn-dark btn-sm py-0 text-nowrap'>Edit Evaluation</a></Link>
                                            {/* <a className='btn btn-dark btn-sm py-0 text-nowrap' href={`/user/evaluations/${evaluation.id}`}> Preview form</a> */}
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

export default Evaluations