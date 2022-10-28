import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { doGetSession, getResource } from '../../../utilities'

function Roles() {
  const [roles, setRoles] = useState([])
  const [session, setSession] = useState([])
  const [status, setStatus] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true);
  const router = useRouter()


  useEffect(() => {
      doGetSession().then((session) => {
          if (session) {
              setSession(session)
              // fetch roles
              getResource('roles').then((data) => {
                  if(data.status === true){
                      setRoles(data?.data)
                      setStatus('')   // ('success')
                      setMessage('')  // ('Roles fetched successfully')
                  }else{
                      setStatus('error')
                      setMessage(data.message)
                  }
                  setLoading(false)
              }).catch((err) => {
                  console.log(err)
                  setStatus('error')
                  setMessage('Error fetching roles: ' + err.message || err)
                  setLoading(false)
              })
          } else {
              router.push('/auth/login', undefined, { unstable_skipClientCache: true })
          }
      })
  }, [])


  if (loading) return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h5 className='mb-0'>Loading...</h5>
  </main>

  // return (
  //     <main>
  //         <Head>
  //             <title>Roles</title>
  //         </Head>
  //         <div className="container">
  //             <pre>{JSON.stringify(roles, null, 2)}</pre>
  //         </div>
  //     </main>
  // )
  return (
    <>
      <Head>
        <title>EPT | Roles</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <h1 className="font-bold my-4">Roles</h1>
                    <div className="d-flex align-items-center my-2">
                        <form className="input-group">
                            <input type="text" className="form-control" placeholder="Search" />
                            <button className="btn btn-primary bg-dark">Search</button>
                        </form>
                    </div>
                </div>
                <div className="d-flex w-100">
                    <div className="table-responsive w-100">
                        <table className="table table-striped table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Created At</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles && roles.length > 0 ? roles.map((role) => (

                                    <tr key={role.uuid}>
                                        <td>
                                            {role?.name}
                                        </td>
                                        <td>
                                            {role?.description}
                                        </td>
                                        <td className='text-capitalize'>{role.deleted_at == null ? <span className='badge bg-success'>Active</span> : <span className='badge bg-warning'>Disabled</span>}</td>
                                        <td>{new Date(role?.created_at).toLocaleString('en-GB', {
                                            year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
                                        }) || "-"}</td>
                                        <td className="d-flex flex-column flex-md-row gap-2 justify-content-center">
                                            <Link href={{ pathname: `/role/${role.uuid}/edit` }} >
                                                <a className='btn btn-primary btn-sm py-0 text-nowrap'>Edit Role</a>
                                            </Link>
                                                <a className='btn text-danger btn-link btn-sm py-0 text-nowrap' onClick={ev=>{
                                                    ev.preventDefault();
                                                    ev.stopPropagation();
                                                    if(confirm('Are you sure you want to delete this role?')){
                                                        getResource(`roles/delete/${role.uuid}`, {uuid: role.uuid}).then((data) => {
                                                            if(data.status === true){
                                                                setStatus('success')
                                                                setMessage('Role deleted successfully')
                                                                setRoles(roles.filter(u=>u.uuid !== role.uuid))
                                                            }else{
                                                                setStatus('error')
                                                                setMessage(data.message)
                                                            }
                                                        }).catch((err) => {
                                                            console.log(err)
                                                            setStatus('error')
                                                            setMessage('Error deleting role: ' + err.message || err)
                                                        } )
                                                    }
                                                }}>Delete Role</a>
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan={7} className="text-center">No roles found</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    </>
  )
}

export default Roles