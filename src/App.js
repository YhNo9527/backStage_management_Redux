import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Admin from './pages/admin/Admin'
import Login from './pages/Login/Login'
 
export default function App() {
    return (
        <>
            <Routes>
                <Route path= '/*' element= { <Admin/> } />
                <Route path= '/login' element= { <Login/> } />
                <Route index element= { <Navigate to= '/login'/> }/>
            </Routes>
        </>
    )
}
