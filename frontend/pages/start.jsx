import React from 'react';
import PropTypes from 'prop-types';
import FileDrop from '../components/FileDrop';

const start = (props) => {
  return (
    <div
      style={{
        padding: '2rem 0',
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1>Upload A Candidate</h1>
      <FileDrop />
    </div>
  );
};

start.propTypes = {};

export default start;
