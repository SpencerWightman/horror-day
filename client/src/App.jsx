import { useState, useEffect } from "react";
import Login from "./components/login";
import Journal from "./components/journal";
import SingleEntry from "./components/single-entry";
import Entries from "./components/entries";

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

const ProtectedRoute = ({ child }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return child;
};

const App = () => {
  const [username, setUsername] = useState("");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login username={username} setUsername={setUsername} />} />
        <Route 
          path="/journal" 
          element={
            <ProtectedRoute>
              <Journal username={username}/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/entry/:id" 
          element={
            <ProtectedRoute>
              <SingleEntry username={username}/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/entries" 
          element={
            <ProtectedRoute>
              <Entries username={username}/>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
