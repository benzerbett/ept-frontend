import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function ViewPermission() {
  const router = useRouter()
  const {permission} = router.query
  return (
    <>
      <Head>
        <title>EPT | View Permission</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>ViewPermission {permission}</div>
    </>
  )
}

export default ViewPermission