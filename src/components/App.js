import "../css/index.css";
import React from "react";
import { ProvideAuth } from "./auth/useAuth";
import { 
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline'
import NavBar from "./NavBar";
import PrivateRoute from "./auth/PrivateRoute";
import Login from "./auth/Login";
import Top from "./Top";
import NewInvitation from "./invitaion/NewInvitation"
import ShowInvitation from "./invitaion/ShowInvitation";
import EditInvitation from "./invitaion/EditInvitation";


function App() {
    return (
        <Router>
            <CssBaseline />
            <ProvideAuth>
                <NavBar />
                <Switch>
                    <Route exact path="/">
                        <Top />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <PrivateRoute path="/invitations/new">
                        <NewInvitation />
                    </PrivateRoute>
                    <PrivateRoute exact path="/invitations/:id">
                        <ShowInvitation />
                    </PrivateRoute>
                    <PrivateRoute path="/invitations/:id/edit">
                        <EditInvitation />
                    </PrivateRoute>
                </Switch>
            </ProvideAuth>
        </Router>
    );
}

export default App;
