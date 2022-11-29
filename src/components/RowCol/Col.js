import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';

const Col = ({ children, xs, ...otherProps }) => {
  return (
    <Grid item {...otherProps} xs={xs}>
      {children}
    </Grid>
  );
};

Col.defaultProps = {
  xs: 12,
};

Col.propTypes = {
  children: PropTypes.node,
  xs: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Col;
