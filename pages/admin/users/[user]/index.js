import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function ViewUser() {
  const router = useRouter()
  const {user} = router.query
  return (
    <>
      <Head>
        <title>EPT | View User</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>View User {user}</div>
    </>
  )
}

export default ViewUser