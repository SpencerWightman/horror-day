import { useState } from "react";
import Login from "./components/login";
import Journal from "./components/journal";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import {
  Routes,
  Route,
  BrowserRouter
} from 'react-router-dom'

const App = () => {
  const [token, setToken] = useState(null)

  if(!token) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/gym/login" element={
            <>
              <div className="justify-center flex">
                <Login setToken={setToken} />
              </div>
            </>
          } />
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/journal" element={
          <>
            <div className="justify-center flex">
              <Journal />
            </div>
          </>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
