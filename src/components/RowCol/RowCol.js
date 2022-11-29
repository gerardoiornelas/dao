import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid } from '@mui/material';

const RowCol = ({ children, mb, ...otherProps }) => {
  return (
    <>
      <Grid container {...otherProps}>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
      <Box mb={mb} />
    </>
  );
};

RowCol.propTypes = {
  mb: PropTypes.number,

  children: PropTypes.node,
};

export default RowCol;
