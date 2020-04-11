import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Spin } from 'antd';

import './App.scss';

import config from './config';

const SendComponent = React.lazy(() => import('./Components/Send'));
const ViewComponent = React.lazy(() => import('./Components/View'));

const AppContainer = props => {
    const paths = config.paths;

    return (
        <Switch>
            <Route path={`/${paths.send}`}>
                <React.Suspense fallback={<Spin size="large" />}>
                    <SendComponent />
                </React.Suspense>
            </Route>
            <Route path={`/${paths.view}`}>
                <React.Suspense fallback={<Spin size="large" />}>
                    <ViewComponent />
                </React.Suspense>
            </Route>
            <Route path="*">
                <Redirect to={`/${paths.send}`} />
            </Route>
        </Switch>
    );
};

export default AppContainer;
