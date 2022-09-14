import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function PermissionsForm() {
  const router = useRouter()
  const {permission} = router.query
  return (
    <>
      <Head>
        <title>EPT | Edit Permission</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>Edit Permission {permission}</div>
    </>
  )
}

export default PermissionsForm