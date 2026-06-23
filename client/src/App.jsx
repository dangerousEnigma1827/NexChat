import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Register from './pages/Register'
import HomePage from './pages/Homepage'
import Login from './pages/Login'
import ProtectedRoutes from './Components/ProtectedRoutes'
import RegisterStep2 from './pages/RegisterStep2'

function App() {
  return(
    <>
    <Toaster position="top-right"/>
     <Routes>
        <Route path='/register' element={<Register/>}/>
        <Route path='/register-step2' element={<RegisterStep2/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/' element={<ProtectedRoutes><HomePage/></ProtectedRoutes>}/>
      </Routes> 
    </>
  )
}

export default App
