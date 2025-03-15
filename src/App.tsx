import React, { useEffect } from 'react'
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
import supabase from './supabaseClient'
import { useRootContext } from './Context'
import { devLog } from './utils'

const App: React.FC = () => {
  const location = useLocation();
  const { setSession, session } = useRootContext();
  const isLogin = location.pathname === '/login';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  devLog(session);

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