import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function NewEvaluationForm() {
  const router = useRouter()
  const {evaluation} = router.query
  return (
    <>
      <Head>
        <title>EPT | New EvaluationForm</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>New {evaluation} Evaluation</div>
    </>
  )
}

export default NewEvaluationForm