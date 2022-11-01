import Head from 'next/head'
import React from 'react'

function Admin() {
    return (
        <>
            <Head>
                <title>EPT | Admin Dashboard</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="container">
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                    <h1 className="font-bold my-4">Dashboard</h1>
                    <div className="d-flex align-items-center my-2">
                        <form className="input-group">
                            <input type="text" className="form-control" placeholder="Search" />
                            <button className="btn btn-primary bg-dark"><i className='fa fa-search'></i></button>
                        </form>
                    </div>
                </div>
                <div className="row d-flex">
                    <div className='col-lg-4 col-sm-12'>
                        <div className="card">
                            <div className="card-body">
                                <h3 className="card-title">Users</h3>
                                <h6 className="card-subtitle mb-2 text-muted ">&nbsp;</h6>
                                <hr />
                                <table className="table table-striped table-sm">
                                    <tbody>
                                        <tr>
                                            <td>All</td>
                                            <td>
                                                <b>0</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Active</td>
                                            <td>
                                                <b>0</b>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-4 col-sm-12'>
                        <div className="card">
                            <div className="card-body">
                                <h3 className="card-title">Programs</h3>
                                <h6 className="card-subtitle mb-2 text-muted ">&nbsp;</h6>
                                <hr />
                                <table className="table table-striped table-sm">
                                    <tbody>
                                        <tr>
                                            <td>All</td>
                                            <td>
                                                <b>0</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Active</td>
                                            <td>
                                                <b>0</b>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-4 col-sm-12'>
                        <div className="card">
                            <div className="card-body">
                                <h3 className="card-title">Submissions</h3>
                                <h6 className="card-subtitle mb-2 text-muted ">Form responses in the last 7 days</h6>
                                <hr />
                                <table className="table table-striped table-sm">
                                    <tbody>
                                        <tr>
                                            <td>All submissions</td>
                                            <td>
                                                <b>0</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Updates</td>
                                            <td>
                                                <b>0</b>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <div className='row'>
                    <div className='col-lg-12 col-sm-12'>
                        <div className="card">
                            <div className="card-body">
                                <h3 className="card-title">Trends in user activity</h3>
                                <h6 className="card-subtitle mb-2 text-muted ">Form responses in the last 30 days</h6>
                                <hr />
                                <div className="chart-container">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Admin