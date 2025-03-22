import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { About, Home, Login, Movie, Profile, SearchResults, TV, Favorites } from './pages';

import { Header, Navbar, Searchbar } from './components'

import supabase from './supabaseClient'
import { useRootContext } from './Context'
import { devLog } from './utils'
import { FavoritesListType, UserType } from './types'
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
  const { setSession, session, setUser, toastInfo, setFavorites } = useRootContext();
  const isLogin: boolean = location.pathname === '/login';
  const isProfile: boolean = location.pathname === '/profile';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        const userDataFromSession: UserType = {
          id: session.user.id,
          username: session.user.user_metadata.full_name,
          email: session.user.email!,
          avatar_url: session.user.user_metadata.avatar_url || session.user.user_metadata.picture,
        }
        const addUser = async () => {
          const { data, error } = await supabase
            .from("users")
            .upsert([userDataFromSession], { onConflict: "id" });

          if (error) {
            devLog("Error adding user", error);
          } else {
            devLog("User added", data);
          }
        }
        setUser(userDataFromSession);
        addUser();


        async function getFavorites(user_id: string) {
          const { data, error } = await supabase
            .from('user_lists')
            .select('*')
            .eq('user_id', user_id)
            .eq('list_name', 'Favorites')
            .single();

          if (error) {
            return null;
          }

          return data;
        }
        async function getFavoritesWithRetry(user_id: string, delay = 500) {
          while (true) {
            const data = await getFavorites(user_id);

            if (data) {
              devLog("Favorites found:", data);
              const favorites: FavoritesListType = {
                listId: data.list_id,
                listName: data.list_name,
                listItems: data.list_items ? data.list_items : []
              };
              setFavorites(favorites);
              return data;
            }

            devLog("Favorites not found, retrying in", delay, "ms...");
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
        getFavoritesWithRetry(session.user.id)
      }
    });

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

  devLog("Session", session);

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