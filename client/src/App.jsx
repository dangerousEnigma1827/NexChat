import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Register from './pages/Register'
import HomePage from './pages/HomePage'
import Login from './pages/Login'

function App() {
  return(
    <>
    <Toaster position="top-right"/>
     <Routes>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/' element={<HomePage/>}/>
      </Routes> 
    </>
  )
}

export default App
