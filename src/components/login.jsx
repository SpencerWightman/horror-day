import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// eslint-disable-next-line react/prop-types
const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setPassword(e.target.value);
  };

  const validatePassword = () => {
    if (password.trim() === '') {
      setError('Password is required');
      return false;
    } 
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validatePassword()) {
      if (import.meta.env.VITE_PASS === password) {
        console.log('Password matched');
        setToken(true);
        navigate('/journal');
      } else {
        console.log('Password did not match');
        setError('Incorrect password');
      }
    } else {
      console.log('Form has validation errors');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      p={2}
    >
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', width: '100%' }}>
        <Box mb={1}>
          <TextField
            type="password"
            label="Password"
            name="password"
            value={password}
            onChange={handleInputChange}
            helperText={error}
            error={!!error}
            fullWidth
            margin="normal"
          />
        </Box>

        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default Login;
