import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function RolesForm() {
  const router = useRouter()
  const {role} = router.query
  return (
    <>
      <Head>
        <title>EPT | Edit Role</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>Edit Role {role}</div>
    </>
  )
}

export default RolesForm