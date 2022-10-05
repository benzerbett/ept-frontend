import Head from 'next/head'
import React from 'react'
import Signup from '../../auth/signup'

function NewUserForm() {
  return (
    <>
      <div className='container'>New User</div>
      <Signup></Signup>

    </>
  )
}

export default NewUserForm