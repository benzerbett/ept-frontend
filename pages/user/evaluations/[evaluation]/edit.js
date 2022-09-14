import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function EvaluationForm() {
  const router = useRouter()
  const {evaluation} = router.query
  return (
    <>
      <Head>
        <title>EPT | Edit Evaluation</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>Edit Evaluation {evaluation}</div>
    </>
  )
}

export default EvaluationForm