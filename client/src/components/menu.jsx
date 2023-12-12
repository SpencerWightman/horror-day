import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div style={{ position: 'fixed', top: 10, right: 10 }}>
      <button onClick={() => setIsOpen(!isOpen)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      {isOpen && (
        <div style={{ 
          position: 'absolute', 
          right: 0, 
          background: 'black',
        }}>
          <div onClick={() => handleNavigate('/journal')} className="dropdown-item">Journal</div>
          <div onClick={() => handleNavigate('/entries')} className="dropdown-item">Entries</div>
        </div>
      )}
    </div>
  );  
};

export default Menu;
