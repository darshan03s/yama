import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { About, Home, Login, Movie, Profile, SearchResults, TV } from './pages';

import { Header, Navbar, Searchbar } from './components'

import supabase from './supabaseClient'
import { useRootContext } from './Context'
import { devLog } from './utils'
import { UserType } from './types'
import toast, { Toaster } from 'react-hot-toast';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useRootContext();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const location = useLocation();
  const { setSession, session, setUser, toastInfo } = useRootContext();
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

    // toast.error('Welcome back!', {
    //   duration: 4000,
    //   position: 'top-center',
    //   icon: null,
    //   style: {
    //     background: 'red',
    //     color: 'white',
    //     borderRadius: '50px',
    //     fontSize: '16px',
    //   }
    // });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (toastInfo.message) {
      switch (toastInfo.type) {
        case 'success':
          toast.success(toastInfo.message);
          break;
        case 'error':
          toast.error(toastInfo.message);
          break;
        default:
          toast.error(toastInfo.message);
          break;
      }
    }
  }, [toastInfo]);

  devLog(session);

  return (
    <>
      <Header />
      {!isLogin && !isProfile && <Navbar />}
      {!isLogin && !isProfile && <Searchbar />}
      <Toaster />
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