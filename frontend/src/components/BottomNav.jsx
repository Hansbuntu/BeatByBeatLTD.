import { NavLink } from 'react-router-dom'

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 md:hidden bg-white dark:bg-black border-t-2 border-black dark:border-white z-50">
      <div className="grid grid-cols-4 text-xs text-center">
        <Tab to="/">Home</Tab>
        <Tab to="/discover">Discover</Tab>
        <Tab to="/store">Store</Tab>
        <Tab to="/account">Account</Tab>
      </div>
    </nav>
  )
}

function Tab({ to, children }) {
  return (
    <NavLink to={to} end className={({isActive}) => `py-3 ${isActive ? 'font-semibold text-black dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
      {children}
    </NavLink>
  )
}


