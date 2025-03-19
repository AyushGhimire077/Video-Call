import React, { useContext } from 'react'
import { AuthContext } from "./providers/AuthContex";
import { Routes, Route } from 'react-router-dom'
import Auth from './pages/Auth';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import CallBox from './components/CallBox';
import RoomPage from './pages/Room';


const App = () => {
  
  const { login } = useContext(AuthContext);

  return (
    <>
    <ToastContainer className="mt-16 bg-[#1A1A1A] text-white" />  
    <Routes>
      {login ? (
         <>
            <Route path="/" element={<Home />} />
            <Route path="/room/:roomID" element={<RoomPage />} />
         </>
      ) : (
        <>
          <Route path="/" element={<Auth />} />
        </>
        )}

        <Route path="/user/:id"  element={<CallBox />} />
        
      </Routes>
    </>
  )
}

export default App
