import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#991b1b' },
  },
});

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
    <>
    <p className="block text-stone-500 font-extrabold py-2.5 px-4 rounded hover:cursor-default">HORRIFY YOUR DAY</p>
    <ThemeProvider theme={theme}>
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="70vh"
      p={2}
    >
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', width: '100%' }}>
        <Box mb={1}>
          <TextField
            autoFocus
            type="password"
            label="Password"
            name="password"
            value={password}
            onChange={handleInputChange}
            helperText={error}
            error={!!error}
            fullWidth
            margin="normal"
            color="primary" // Use the primary color from the theme
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          style={{
            marginTop: '8px', // equivalent to mt-2 in Tailwind
            backgroundColor: 'black',
            color: '#b4b4b4', // equivalent to text-stone-300 in Tailwind
            fontWeight: 'bold', // equivalent to font-extrabold in Tailwind
            padding: '10px 16px', // equivalent to py-2.5 px-4 in Tailwind
            borderRadius: '4px', // equivalent to rounded in Tailwind
            transition: 'background-color 200ms', // equivalent to transition duration-200 in Tailwind
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#991b1b'} // hover:bg-red-800 in Tailwind
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'black'}
        >
          Submit
        </Button>
      </form>
    </Box>
    </ThemeProvider>
    </>
  );
};

export default Login;
