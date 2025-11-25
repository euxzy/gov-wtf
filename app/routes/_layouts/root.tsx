import { Outlet } from 'react-router'
import { Header } from '~/components/shared/header'

export default function RootLayout() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}
