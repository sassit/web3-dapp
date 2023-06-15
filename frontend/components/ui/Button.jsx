import React from 'react';

const buttonStyle = {
  backgroundColor: 'lightblue',
  color: 'black',
  padding: '1rem',
  border: 'none',
  borderRadius: '2rem',
  cursor: 'pointer',
};

const Button = ({ children, onClick }) => {
  return (
    <button style={buttonStyle} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
