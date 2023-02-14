import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

const TokensSoldProgress = ({ tokensSold, maxTokens }) => {
  return (
    <>
      <LinearProgress
        variant="determinate"
        value={(tokensSold / maxTokens) * 100}
      />
      <Box display="flex" justifyContent={`center`}>
        <Typography>{`${tokensSold} / ${maxTokens} Tokens Sold`}</Typography>
      </Box>
    </>
  );
};

export default TokensSoldProgress;
