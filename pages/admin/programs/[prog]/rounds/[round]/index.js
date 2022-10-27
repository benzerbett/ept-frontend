import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function ViewRound() {
  const router = useRouter()
  const {prog, round} = router.query
  return (
    <>
      <Head>
        <title>EPT | View Round</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>ViewRound Program:{prog}, Round:{round}</div>
    </>
  )
}

export default ViewRound