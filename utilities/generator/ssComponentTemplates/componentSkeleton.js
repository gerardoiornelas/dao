module.exports = (componentName) => ({
  content: `
  import React from 'react';
  import { Box } from '@mui/material';
  import Skeleton from '@mui/material/Skeleton';;
  
  const ${componentName}Skeleton = ({ ...otherProps }) => {
    return (
      <Box {...otherProps}>
        <Box>
          <Skeleton
            width={175}
            style={{ marginRight: "24px", padding: "6px 8px" }}
            animation="wave"
          />
        </Box>
        <Box mb={2}>
          <Skeleton
            width={250}
            style={{ marginRight: "24px", padding: "6px 8px" }}
            animation="wave"
          />
        </Box>
        <Box>
          <Skeleton
            width={195}
            style={{ marginRight: "24px", padding: "6px 8px" }}
            animation="wave"
          />
        </Box>
        <Box>
          <Skeleton
            width={235}
            style={{ marginRight: "24px", padding: "6px 8px" }}
            animation="wave"
          />
        </Box>
        <Box>
          <Skeleton
            width={175}
            style={{ marginRight: "24px", padding: "6px 8px" }}
            animation="wave"
          />
        </Box>
      </Box>
    );
  };
  
  export default ${componentName}Skeleton;
  `,
  extension: `Skeleton.js`,
});
