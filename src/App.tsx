import React from 'react'
import { Route, Routes } from 'react-router-dom'

const Header: React.FC = () => {
  return (
    <div className='text-3xl flex justify-center items-center w-full'>Header</div>
  )
}

const Home: React.FC = () => {
  return (
    <div className='text-3xl flex justify-center items-center w-full h-[80vh]'>App</div>
  )
}

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </>
  )
}

export default App