import Head from 'next/head'
import React from 'react'
import ProgramsNavbar from '../../../../../components/common/ProgramsNavbar'

function NewForm() {
    const router = useRouter()
    const { prog } = router.query
    return (
        <>
            <Head>
                <title>EPT | New Form</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='container p-0'>
                <ProgramsNavbar router={router} />
                <div className='row mt-5'>
                    <div className='col-md-12'>
                        NewForm Program:{prog}
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewForm