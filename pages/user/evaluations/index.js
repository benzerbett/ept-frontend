import Head from 'next/head'
import React from 'react'
import Link from 'next/link'
import { simulateGetSession } from '../../../utilities'
import { useRouter } from 'next/router'

function Evaluations() {
    const [evaluations, setEvaluations] = React.useState([])
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
            console.log(session)
            if (session && session.activeProgramCode) {
                const ap = getProgramConfig(session.activeProgramCode)
                ap.then((data) => {
                    setActiveConfig(data)
                    let svys = []
                    data.rounds.map(round => {
                        if (round.active) {
                            svys = Array.from([...svys, data.forms.find(f => f.code == round.form)], fm => {
                                return {
                                    code: fm.code,
                                    name: fm.name,
                                    description: fm.description,
                                    metadata: fm.metadata,
                                }
                            })
                        }
                    })
                    setEvaluations(svys)
                })
            } else {
                router.push('/user')
            }
        }
    }, [])

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
                                    
                                    <tr key={evaluation.code}>
                                        <td>
                                            <a href={`/user/evaluations/${evaluation.code}`}>{evaluation.name}</a>
                                        </td>
                                        <td className='text-capitalize'>{evaluation.status == 'open' ? <span className='badge bg-success'>Open</span>: evaluation.status || "-"}</td>
                                        <td>{new Date(evaluation.metadata.created).toDateString('en-GB') || "-"}</td>
                                        <td>{new Date(evaluation.metadata.due_date).toDateString('en-GB') || "-"}</td>
                                        <td>No</td>
                                        <td className="d-flex flex-column flex-md-row gap-2 justify-content-center">
                                            <Link href={{
                                                  pathname: `/user/evaluations/${evaluation.code}/new`,
                                                  
                                                }}
                                            > 
                                            <a className='btn btn-primary btn-sm py-0 text-nowrap'>Take Evaluation</a></Link>
                                            <Link href={{
                                                  pathname: `/user/evaluations/${evaluation.code}/new`,
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