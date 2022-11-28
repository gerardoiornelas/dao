
  import React from 'react';
  import { render } from '@testing-library/react';
  import App from './App';

  describe('<App/> spec', () => {
   
    test('should render <App/>', () => {
      render(<App/>);
    });

  });

  