import { useState, useEffect } from "react";
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

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        setIsAuthenticated(data.isAuthenticated);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { isAuthenticated, loading };
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or some loading component
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/journal" 
          element={
            <ProtectedRoute>
              <Journal />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
