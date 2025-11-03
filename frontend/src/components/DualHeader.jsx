import { NavLink, Link } from 'react-router-dom'
import SearchBar from './SearchBar.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import { useAuth } from '../hooks/useAuth.js'

export default function DualHeader() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-black border-b-2 border-black dark:border-white shadow">
      {/* Top utility bar */}
      <div className="hidden md:block">
        <div className="max-w-6xl mx-auto px-4 py-2 grid grid-cols-3 items-center gap-4">
          <nav className="text-sm flex items-center gap-4 text-black dark:text-white">
            <NavLink to="/submit" className="hover:opacity-80">Submit</NavLink>
            <NavLink to="/store" className="hover:opacity-80">Store</NavLink>
          </nav>
          <div className="flex items-center justify-center">
            <Link to="/" className="text-2xl font-extrabold tracking-wide text-black dark:text-white">
              beatbybeatrecordltd
            </Link>
          </div>
          <div className="flex items-center justify-end gap-3">
            <SearchBar />
            <ThemeToggle />
            {isAuthenticated ? (
              <button onClick={logout} className="text-sm text-black dark:text-white hover:opacity-80">Logout</button>
            ) : (
              <NavLink to="/login" className="text-sm text-black dark:text-white hover:opacity-80">Login</NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Mobile logo bar */}
      <div className="md:hidden border-b-2 border-black dark:border-white">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-extrabold tracking-wide text-black dark:text-white">
            beatbybeatrecordltd
          </Link>
          <div className="flex items-center gap-2">
            <SearchBar />
            <ThemeToggle />
            {isAuthenticated ? (
              <button onClick={logout} className="text-sm text-black dark:text-white hover:opacity-80">Logout</button>
            ) : (
              <NavLink to="/login" className="text-sm text-black dark:text-white hover:opacity-80">Login</NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Primary nav */}
      <div className="border-t-2 border-black dark:border-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6 overflow-x-auto">
          <NavLink to="/" end className={({isActive}) => navClass(isActive)}>Home</NavLink>
          <NavLink to="/posts" className={({isActive}) => navClass(isActive)}>Blog</NavLink>
          <NavLink to="/artists" className={({isActive}) => navClass(isActive)}>Artists</NavLink>
          <NavLink to="/store" className={({isActive}) => navClass(isActive)}>Exclusives</NavLink>
          <NavLink to="/discover" className={({isActive}) => navClass(isActive)}>Discover</NavLink>
          <NavLink to="/about" className={({isActive}) => navClass(isActive)}>About</NavLink>
        </div>
      </div>
    </header>
  )
}

function navClass(isActive) {
  return `uppercase tracking-wide text-sm whitespace-nowrap ${isActive ? 'font-extrabold text-black dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'}`
}


