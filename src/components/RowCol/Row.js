import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid } from '@mui/material';

const Row = ({ children, mb, ...otherProps }) => {
  return (
    <>
      <Grid container {...otherProps}>
        {children}
      </Grid>
      <Box mb={mb} />
    </>
  );
};

Row.propTypes = {
  mb: PropTypes.number,

  children: PropTypes.node,
};

export default Row;
