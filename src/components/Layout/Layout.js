import * as React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../theme";
import {
  googleFonts,
  metaDescription,
  metaKeywords,
  appTitle,
} from "../../theme/theme-config";

export default function TopLayout(props) {
  return (
    <React.Fragment>
      <Helmet>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <title>{`${appTitle}`}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link href={`${googleFonts}`} rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"
        ></link>
      </Helmet>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {props.children}
      </ThemeProvider>
    </React.Fragment>
  );
}

TopLayout.propTypes = {
  children: PropTypes.node,
};
