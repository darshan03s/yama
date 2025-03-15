import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import Home from './pages/Home'
import About from './pages/About'
import Movie from './pages/Movie'
import TV from './pages/TV'

import Header from './components/Header'
import Navbar from './components/Navbar'
import Searchbar from './components/Searchbar'
import SearchResults from './pages/SearchResults'
import Login from './pages/Login'

const App: React.FC = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <>
      <Header />
      {!isLogin && <Navbar />}
      {!isLogin && <Searchbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/movie/:id' element={<Movie />} />
        <Route path='/tv/:id' element={<TV />} />
        <Route path='/search' element={<SearchResults />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App