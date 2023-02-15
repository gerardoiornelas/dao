import React from "react"
import { CircularProgress } from "@mui/material"

import { StyledLoading } from "./Loading.styled"

const Loading = ({ ...otherProps }) => {
  return (
    <StyledLoading my={5}>
      <CircularProgress {...otherProps} />
    </StyledLoading>
  )
}

export default Loading
