import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function ViewEvaluation() {
  const router = useRouter()
  const {evaluation} = router.query
  return (
    <>
      <Head>
        <title>EPT | ViewEvaluation</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>ViewEvaluation {evaluation}</div>
    </>
  )
}

export default ViewEvaluation