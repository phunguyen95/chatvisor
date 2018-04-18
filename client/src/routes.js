import React from 'react';
import HomePage from './pages/Homepage';
const routes = [
  {
    path: '/',
    exact: true,
    main: () => <HomePage />
  }
];
export default routes;
