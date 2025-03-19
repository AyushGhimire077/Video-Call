import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { MainContextProvider } from "./providers/MainContext.jsx";

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <MainContextProvider>
       <App />
    </MainContextProvider>
  </BrowserRouter>,

)
