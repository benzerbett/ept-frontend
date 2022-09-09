import PublicTheme from '../components/layouts/PublicTheme'
import AppTheme from '../components/layouts/AppTheme'
import { useState } from 'react'

function MyApp({ Component, pageProps }) {
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const Layout = isLoggedIn ? AppTheme : PublicTheme
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    )
}

export default MyApp