import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function Layout() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  )
}
