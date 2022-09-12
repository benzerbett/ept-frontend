import PublicNavbar from '../common/PublicNavbar'
import PublicFooter from '../common/PublicFooter'

export default function PublicTheme({ children }) {
    return (
        <div className='d-flex' style={{ minHeight: '100vh', flexDirection: 'column' }}>
            <PublicNavbar />
            <main className='flex-shrink-0 p-3 mt-5'>
                {children}
            </main>
            <PublicFooter />
        </div>
    )
}