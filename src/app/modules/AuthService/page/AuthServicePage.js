import DialogNotify from 'app/components/DialogNotify';
import React from 'react';
import { Redirect, Switch, useRouteMatch } from 'react-router-dom';
import ErrorPage from '../../Error/ErrorPage';
import MyProfilePage from './MyProfile';
import PermissionPage from './Permission';
import Roles from './Roles';
import UserPage from './Users';
import UserList from './Users/UserList/index';
import UserDetailPage from './Users/UserList/Detail';
import DetailUser from './Users/UserList/Detail/DetailUser';
import { ContentRoute } from '../../../../_metronic/layout';

export default function AuthServicePage() {
    const match = useRouteMatch();

    return (
        <>
            <DialogNotify />
            <Switch>
                {
                    <Redirect
                        exact={true}
                        from={match.url}
                        to={`${match.url}/users`}
                        need={['users']}
                    />
                }
                <ContentRoute
                    path={`${match.url}/users/:id/user-detail`}
                    component={DetailUser}
                    need={['users']}
                />
                <ContentRoute
                    exact
                    path={`${match.url}/users/:id/detail`}
                    component={UserDetailPage}
                    need={['users']}
                />
                <ContentRoute
                    path={`${match.url}/users/list-users}`}
                    component={UserList}
                    need={['users']}
                />
                <ContentRoute
                    path={`${match.url}/users`}
                    component={UserPage}
                    need={['users']}
                />
                <ContentRoute
                    path={`${match.url}/roles`}
                    component={Roles}
                    need={['users']}
                />
                <ContentRoute
                    path={`${match.url}/permissions`}
                    component={PermissionPage}
                    need={['users']}
                />
                <ContentRoute
                    path={`${match.url}/profile`}
                    component={MyProfilePage}
                    need={['user']}
                />
                <ContentRoute component={ErrorPage} />
            </Switch>
        </>
    );
}
