import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function EditRound() {
  const router = useRouter()
  const {prog, round} = router.query
  return (
    <>
      <Head>
        <title>EPT | Edit Round</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>EditRound Program:{prog}, Round:{round}</div>
    </>
  )
}

export default EditRound