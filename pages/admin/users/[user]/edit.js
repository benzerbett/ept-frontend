import Head from 'next/head'
import React from 'react'

function UserForm({ user }) {
  return (
    <>
      <Head>
        <title>EPT | Edit User</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>Edit User {user}</div>
    </>
  )
}

export default UserForm