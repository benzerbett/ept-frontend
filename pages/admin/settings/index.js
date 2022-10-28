import Head from 'next/head'
import React from 'react'
import { doGetSession } from '../../../utilities'

function AccountSettings() {
    const [user, setUser] = React.useState(null)
    const [isLoggedIn, setIsLoggedIn] = React.useState(false)
    const [homeUrl, setHomeUrl] = React.useState('/')
    const [allPrograms, setAllPrograms] = React.useState([])

    React.useEffect(() => {
        let mtd = true
        if (mtd) {
            doGetSession().then(session => {
                if (session) {
                    setUser(session.user)
                    setIsLoggedIn(true)
                    setHomeUrl(session.user.type === 'admin' ? '/admin' : '/user')
                } else {
                    router.push('/auth/login', undefined, { unstable_skipClientCache: true })
                }
            })
        }
        return () => {
            mtd = false
        }
    }, [])

    return (
        <>
            <Head>
                <title>EPT | System Settings</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='container'>
                <h2>System Settings</h2>
                <hr/>
                <div className="row">
                    <div className='col-md-12 my-3'>
                        <form>
                            <div className="form-group row mb-4 mb-md-5">
                                <div className='col-md-3 py-1'>
                                    <label className='form-label' htmlFor="systemName">System Name</label>
                                    <small className='d-block text-muted lh-sm mb-1'>Job open plural led child careful interest glass mark political happy worry held .</small>
                                </div>
                                <div className='col-md-7'>
                                    <input type="text" className="form-control" id="systemName" placeholder="Enter system name" />
                                </div>
                            </div>
                            <div className="form-group row mb-4 mb-md-5">
                                <div className='col-md-3 py-1'>
                                    <label className='form-label' htmlFor="systemDescription">System Description</label>
                                    <small className='d-block text-muted lh-sm mb-1'>Anyway fat ready speech famous brass equator needle ruler hurt way moment .</small>
                                </div>
                                <div className='col-md-7'>
                                    <input type="text" className="form-control" id="systemDescription" placeholder="Enter system description" />
                                </div>
                            </div>
                            <div className="form-group row mb-4 mb-md-5">
                                <div className='col-md-3 py-1'>
                                    <label className='form-label' htmlFor="systemAddress">System Address</label>
                                    <small className='d-block text-muted lh-sm mb-1'>Mass dawn bar carefully safety which division fire word receive having spirit movement bre.</small>
                                </div>
                                <div className='col-md-7'>
                                    <input type="text" className="form-control" id="systemAddress" placeholder="Enter system address" />
                                </div>
                            </div>
                            <div className="form-group row mb-4 mb-md-5">
                                <div className='col-md-3 py-1'>
                                    <label className='form-label' htmlFor="systemEmail">System Email</label>
                                    <small className='d-block text-muted lh-sm mb-1'>Earth suggest heart former empty audience seems root bar dress thy variety of.</small>
                                </div>
                                <div className='col-md-7'>
                                    <input type="text" className="form-control" id="systemEmail" placeholder="Enter system email" />
                                </div>
                            </div>
                            <div className="form-group row mb-4 mb-md-5">
                                <div className='col-md-3 py-1'>
                                    <label className='form-label' htmlFor="systemPhone">System Phone</label>
                                    <small className='d-block text-muted lh-sm mb-1'>Time sale capital recognize worried safe noon aid floating surprise general exclaimed reach exampl.</small>
                                </div>
                                <div className='col-md-7'>
                                    <input type="text" className="form-control" id="systemPhone" placeholder="Enter system phone" />
                                </div>
                            </div>
                            <div className="form-group row mb-4 mb-md-5">
                                <div className='col-md-3 py-1'>
                                    <label className='form-label' htmlFor="systemLogo">System Logo</label>
                                    <small className='d-block text-muted lh-sm mb-1'>Volume stood fell primitive shoulder brush high journey chamber follow alive excitin.</small>
                                </div>
                                <div className='col-md-7'>
                                    <input type="file" className="form-control" id="systemLogo" />
                                </div>
                            </div>
                            <div className="form-group row mb-4 mb-md-5">
                                <div className='col-md-3 py-1'>
                                    <label className='form-label' htmlFor="systemFavicon">System Favicon</label>
                                    <small className='d-block text-muted lh-sm mb-1'>Lie very fur possible trade sing since while exact subject examine ha.</small>
                                </div>
                                <div className='col-md-7'>
                                    <input type="file" className="form-control" id="systemFavicon" />
                                </div>
                            </div>
                            <div className="form-group row mb-4 mb-md-5">
                                <div className='col-md-3 py-1'>
                                    <label className='form-label' htmlFor="systemTheme">System Theme</label>
                                    <small className='d-block text-muted lh-sm mb-1'>Feathers gently fifteen gravity circle new baseball mighty being feel block soci.</small>
                                </div>
                                <div className='col-md-7'>
                                    <select className="form-select" id="systemTheme">
                                        <option>Default</option>
                                        <option>Dark</option>
                                        <option>Light</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row mb-4 mb-md-5">
                                <div className='col-md-3'>
                                    <label className='form-label' htmlFor="systemLanguage">System Language</label>
                                </div>
                                <div className='col-md-7'>
                                    <select className="form-select" id="systemLanguage">
                                        <option>English</option>
                                        <option>French</option>
                                        <option>Spanish</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row mb-4 mb-md-5">
                                <div className='col-md-3'>
                                    <label className='form-label' htmlFor="systemCurrency">System Currency</label>
                                </div>
                                <div className='col-md-7'>
                                    <select className="form-select" id="systemCurrency">
                                        <option>USD</option>
                                        <option>EUR</option>
                                        <option>GBP</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row mb-4 mb-md-5">
                                <div className='col-md-12 d-flex flex-row gap-3 justify-content-center'>
                                    <input type="submit" className="btn btn-primary px-5" value="Save changes" />
                                    <input type="reset" className="btn btn-link text-muted px-5 ml-3" value="Cancel" />
                                </div>
                            </div>
                        </form>
                    </div >
                </div >
            </div >
        </>
    )
}

export default AccountSettings