import PublicNavbar from '../common/PublicNavbar'
import PublicFooter from '../common/PublicFooter'

export default function PublicTheme({ children }) {
  return (
    <>
      <PublicNavbar />
      <main>{children}</main>
      <PublicFooter />
    </>
  )
}