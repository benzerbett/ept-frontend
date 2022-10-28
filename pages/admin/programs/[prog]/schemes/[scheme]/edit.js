import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import ProgramsNavbar from '../../../../../../components/common/ProgramsNavbar'

function EditScheme() {
    const router = useRouter()
    const { prog, scheme } = router.query
    return (
        <>
            <Head>
                <title>EPT | Edit Scheme</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='container p-0'>
                <ProgramsNavbar router={router} />
                <div className='row mt-5'>
                    <div className='col-md-12'>
                        EditScheme Program:{prog}, Scheme:{scheme}
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditScheme