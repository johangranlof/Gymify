import React from 'react';
import './Title.css';

const Title = ({ text, color }) => {
  return (
    <>
      <h2 className='title-header' style={{ color: color }}>
        {text}
      </h2>
      <hr />
    </>
  );
}

export default Title;
