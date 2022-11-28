import React from "react";
import PropTypes from "prop-types";
import { AppBar, Grid, Box, Typography, Container } from "@mui/material";

import logo from "../../images/logo.png";

import { StyledNavigation } from "./Navigation.styled";

const Navigation = ({ account }) => {
  return (
    <StyledNavigation>
      <AppBar position="static" color="transparent" elevation={0}>
        <Container>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Box display="flex">
                <Box
                  component="img"
                  src={logo}
                  alt={"logo"}
                  sx={{ width: "40px" }}
                />
                <Box>
                  <Typography>WUN Template</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent={"flex-end"}>
                <Typography>{account}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </AppBar>
    </StyledNavigation>
  );
};

Navigation.propTypes = {
  children: PropTypes.node,
};

export default Navigation;
