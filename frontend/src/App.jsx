import { Routes, Route } from 'react-router-dom'
import React from 'react'
import Home from './pages/Home.jsx'
import Posts from './pages/Posts.jsx'
import PostDetail from './pages/PostDetail.jsx'
import Artists from './pages/Artists.jsx'
import ArtistDetail from './pages/ArtistDetail.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminPosts from './pages/AdminPosts.jsx'
import AdminArtists from './pages/AdminArtists.jsx'
import Login from './pages/Login.jsx'
import MiniPlayer from './components/MiniPlayer.jsx'
import DualHeader from './components/DualHeader.jsx'
import BottomNav from './components/BottomNav.jsx'
import Discover from './pages/Discover.jsx'
import Store from './pages/Store.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Library from './pages/Library.jsx'
import Submit from './pages/Submit.jsx'
import Account from './pages/Account.jsx'
import About from './pages/About.jsx'
import AdminProducts from './pages/AdminProducts.jsx'
import AdminOrders from './pages/AdminOrders.jsx'
import AdminSubmissions from './pages/AdminSubmissions.jsx'
import { useAuth } from './hooks/useAuth.js'

function App() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-black dark:text-white">
      <DualHeader />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8 pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/posts/:slug" element={<PostDetail />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/artists/:slug" element={<ArtistDetail />} />
            <Route path="/store" element={<Store />} />
            <Route path="/store/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/library" element={<Library />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/account" element={<Account />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/posts" element={<AdminPosts />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/submissions" element={<AdminSubmissions />} />
            <Route path="/admin/artists" element={<AdminArtists />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </main>
      <footer className="border-t-2 border-black dark:border-white pb-14">
        <div className="max-w-5xl mx-auto px-4 py-4 text-sm text-black dark:text-white opacity-70">
          © {new Date().getFullYear()} <span className="font-extrabold uppercase tracking-wide">BeatByBeatRecordLtd</span>
        </div>
      </footer>
      <BottomNav />
      <MiniPlayer src="" />
    </div>
  )
}

export default App
