module.exports = (componentName) => ({
  content: `
import React from 'react';
import _ from 'lodash';

import { ScreenSmith } from '../ScreenSmith';
import ${componentName}Skeleton from './${componentName}Skeleton';

import useScreenDefinition from '../../hooks/useScreenDefinition';

const LocalComponents = {};

const ${componentName} = () => {
  const { UiDefinitionsData, loadingSd } = useScreenDefinition(
    \`${componentName}\`
  );

  const localStateMap = {
  };

  const callBackFunctions = {
  };

   return loadingSd ? (
    <${componentName}Skeleton />
  ) : (
    <>
      {!_.isNil(UiDefinitionsData) && (
        <ScreenSmith
          definition={UiDefinitionsData}
          functionMap={callBackFunctions}
          stateMap={localStateMap}
          componentMap={LocalComponents}
        />
      )}
    </>
  );
};

export default ${componentName};
`,
  extension: `.js`,
});
