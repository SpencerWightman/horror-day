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
      <button onClick={() => setIsOpen(!isOpen)}>Menu</button>
      {isOpen && (
        <div style={{ position: 'absolute', right: 0 }}>
          <div onClick={() => handleNavigate('/journal')}>Journal</div>
          <div onClick={() => handleNavigate('/entries')}>Entries</div>
        </div>
      )}
    </div>
  );
};

export default Menu;
