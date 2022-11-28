import React from "react";
import PropTypes from "prop-types";
import { CircularProgress } from "@mui/material";

import { StyledLoading } from "./Loading.styled";

const Loading = ({ ...otherProps }) => {
  return (
    <StyledLoading my={5}>
      <CircularProgress {...otherProps} />
    </StyledLoading>
  );
};

Loading.propTypes = {
  children: PropTypes.node,
};

export default Loading;
