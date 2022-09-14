import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function UserForm() {
  const router = useRouter()
  const {user} = router.query
  return (
    <>
      <Head>
        <title>EPT | Edit User</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>Edit User {user}</div>
    </>
  )
}

export default UserForm