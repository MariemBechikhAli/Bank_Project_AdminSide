import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import asyncComponent from "util/asyncComponent";
const UsersViews = ({match}) => (
  <Switch  >
    <Redirect exact from={`${match.url}/`} to={`${match.url}/users`}/>
    <Route path={`${match.url}/users-list`} component={asyncComponent(() => import('./Users-List'))}/>
   

  </Switch>
);

export default UsersViews;
