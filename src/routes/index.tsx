import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import Dashboard from '../pages/Dashboard';

const Routes: React.FC = () => (
  <Switch>
    <Route path={`${process.env.PUBLIC_URL}/`} exact component={SignIn} />
    <Route
      path={`${process.env.PUBLIC_URL}/dashboard`}
      component={Dashboard}
      isPrivate
    />
  </Switch>
);

export default Routes;
