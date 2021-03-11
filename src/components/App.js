import { AuthProvider } from "./auth/useAuth";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import useToggleTheme from "./utils/useToggleTheme";

import NavBar from "./NavBar";
import PrivateRoute from "./auth/PrivateRoute";
import Login from "./auth/Login";
import Top from "./Top";
import SearchResult from "./search/SearchResult";
import NewInvitation from "./invitaion/NewInvitation"
import ShowInvitation from "./invitaion/ShowInvitation";
import EditInvitation from "./invitaion/EditInvitation";
import UserInvitations from "./user/UserInvitations";
import UserParticipations from "./user/UserParticipations";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from '@material-ui/core/styles';

function App() {
    const { theme, handleToggleTheme } = useToggleTheme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <AuthProvider>
                    <NavBar onToggleTheme={handleToggleTheme} />

                    <Switch>

                        <Route exact path="/">
                            <Top />
                        </Route>

                        <Route path="/search">
                            <SearchResult />
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

                        <PrivateRoute exact path="/users/:id">
                            <UserInvitations />
                        </PrivateRoute>

                        <PrivateRoute path="/users/:id/participations">
                            <UserParticipations />
                        </PrivateRoute>

                    </Switch>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;
