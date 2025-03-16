import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import Home from './pages/Home'
import About from './pages/About'
import Movie from './pages/Movie'
import TV from './pages/TV'
import Login from './pages/Login'
import Profile from './pages/Profile'
import SearchResults from './pages/SearchResults'

import Header from './components/Header'
import Navbar from './components/Navbar'
import Searchbar from './components/Searchbar'

import supabase from './supabaseClient'
import { useRootContext } from './Context'
import { devLog } from './utils'
import { UserType } from './types'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useRootContext();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const location = useLocation();
  const { setSession, session, setUser } = useRootContext();
  const isLogin: boolean = location.pathname === '/login';
  const isProfile: boolean = location.pathname === '/profile';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        const userDataFromSession: UserType = {
          name: session.user.user_metadata.full_name,
          email: session.user.email!,
          avatar_url: session.user.user_metadata.avatar_url || session.user.user_metadata.picture,
        }
        setUser(userDataFromSession);
      }
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
      {!isLogin && !isProfile && <Navbar />}
      {!isLogin && !isProfile && <Searchbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/movie/:id' element={<Movie />} />
        <Route path='/tv/:id' element={<TV />} />
        <Route path='/search' element={<SearchResults />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App