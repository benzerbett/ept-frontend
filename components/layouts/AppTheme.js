import AppNavbar from '../common/AppNavbar'
import AppFooter from '../common/AppFooter'

export default function DefaultAppTheme({ children }) {
  return (
    <div className='d-flex' style={{minHeight: '100vh', flexDirection: 'column'}}>
      <AppNavbar />
      <main className='flex-shrink-0 p-3 mt-5'>
        {children}
      </main>
      <AppFooter />
    </div>
  )
}