import Head from 'next/head'
import React from 'react'

function EvaluationForm({evaluation}) {
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