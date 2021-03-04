import { useState, useMemo, useEffect } from "react";

import { ProvideAuth } from "./auth/useAuth";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import NavBar from "./NavBar";
import PrivateRoute from "./auth/PrivateRoute";
import Login from "./auth/Login";
import Top from "./Top";
import NewInvitation from "./invitaion/NewInvitation"
import ShowInvitation from "./invitaion/ShowInvitation";
import EditInvitation from "./invitaion/EditInvitation";

import EventEmitter from "events";

import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';


function App() {
    const [themeType, setThemeType] = useState("light");

    // Navbarに渡すイベントエミッター
    const eventEmitter = useMemo(() => new EventEmitter(), []);

    useEffect(() => {
        const handleToggleTheme = () => {
            setThemeType(themeType === "light" ? "dark" : "light");
        }
        eventEmitter.on("toggleTheme", handleToggleTheme);

        return () => eventEmitter.off("themeChange", handleToggleTheme);
    }, [themeType]);
    

    const theme = useMemo(() =>
        createMuiTheme({
            palette: {
                type: themeType
            },
        }),
        [themeType],
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <ProvideAuth>
                    <NavBar eventEmitter={eventEmitter} />

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
        </ThemeProvider>
    );
}

export default App;
