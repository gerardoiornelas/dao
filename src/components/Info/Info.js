import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";

const Info = ({ account, accountBalance }) => {
  return (
    <>
      <Typography>
        <strong>Account:</strong>
        {` ${account}`}
      </Typography>
      <Typography>
        <strong>Tokens Owned:</strong>
        {` ${accountBalance}`}
      </Typography>
    </>
  );
};

Info.propTypes = {
  account: PropTypes.string,
  accountBalance: PropTypes.number,
};

export default Info;
