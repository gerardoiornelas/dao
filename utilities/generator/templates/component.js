module.exports = (componentName) => ({
  content: `
    import React from 'react';
    import PropTypes from 'prop-types';

    import { Styled${componentName} } from './${componentName}.styled';


    const ${componentName} = ({children}) => {
        return (
            <Styled${componentName}>
                {children}
            </Styled${componentName}>
        )
    }

    ${componentName}.propTypes = {
      children: PropTypes.node
    }

    export default ${componentName}
  `,
  extension: `.js`,
});
