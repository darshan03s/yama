import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { About, Home, Login, Movie, Profile, SearchResults, TV, Favorites } from './pages';

import { Header, Navbar, Searchbar } from './components'

import supabase from './supabaseClient'
import { useRootContext } from './context/Context'
import { devLog } from './utils'
import { UserType } from './types'
import toast, { Toaster } from 'react-hot-toast';
import { addUser, getFavoritesWithRetry, getSession, addFavorites } from './supabaseUtils';
import { TVShowContextProvider } from './context/TVShowContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, fetchingUser } = useRootContext();

  if (!session) {
    if (fetchingUser) {
      return <div className='text-center text-amber-500'>Loading...</div>;
    }
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const location = useLocation();
  const { setSession, session, setUser, toastInfo, setFavorites, setFetchingUser, favorites, setFetchedFavorites } = useRootContext();
  const isLogin: boolean = location.pathname === '/login';
  const isAbout: boolean = location.pathname === '/about';
  const isProfile: boolean = location.pathname.startsWith('/profile');
  const [fetchedSession, setFetchedSession] = useState(false);

  useEffect(() => {
    if (!fetchedSession) {
      getSession().then((session) => {
        setSession(session);
        if (session) {
          const userDataFromSession: UserType = {
            id: session.user.id,
            username: session.user.user_metadata.full_name,
            email: session.user.email!,
            avatar_url: session.user.user_metadata.avatar_url || session.user.user_metadata.picture,
          }

          setUser(userDataFromSession);
          addUser(userDataFromSession);

          getFavoritesWithRetry(session.user.id).then((favorites) => {
            setFavorites(favorites);
          });
        }
      });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setFavorites(favs => ({
          ...favs,
          listItems: []
        }));
        setFetchedFavorites([]);
      }
      setFetchingUser(false);
    });

    return () => {
      subscription.unsubscribe();
    };
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

  useEffect(() => {
    const delay = 2000;
    const handler = setTimeout(() => {
      devLog("Change in favorites, logging after", delay, "ms", favorites);
      if (session?.user.id) {
        addFavorites(favorites, session?.user.id!);
        devLog("Sent favorites to database");
      }
    }, delay);
    return () => clearTimeout(handler);
  }, [favorites]);

  useEffect(() => {
    devLog("Session", session);
    if (session) {
      setFetchedSession(true);
    }
  }, [session]);


  return (
    <>
      <Header />
      {!isLogin && !isProfile && <Navbar />}
      {!isLogin && !isProfile && !isAbout && <Searchbar />}
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/movie/:id' element={<Movie />} />
        <Route path='/tv/:id' element={
          <TVShowContextProvider>
            <TV />
          </TVShowContextProvider>
        } />
        <Route path='/search' element={<SearchResults />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path='/profile/favorites' element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App