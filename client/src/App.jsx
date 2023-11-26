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
  BrowserRouter,
  Navigate,
  useLocation,
} from 'react-router-dom';

const ProtectedRoute = ({ token, children }) => {
  const location = useLocation();

  if (!token) {
    // Redirect to /login; save the current location the user was trying to access
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
  const [token, setToken] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route 
          path="/journal" 
          element={
            <ProtectedRoute token={token}>
              <Journal />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
