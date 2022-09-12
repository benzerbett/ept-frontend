import AdminNavbar from '../common/AdminNavbar'
import AppFooter from '../common/AppFooter'

export default function AdminTheme({ children }) {

  return (
    <div className='d-flex' style={{minHeight: '100vh', flexDirection: 'column'}}>
      <AdminNavbar />
      <main className='flex-shrink-0 p-3 mt-5'>
        {children ? children : null}
      </main>
      <AppFooter />
    </div>
  )
}