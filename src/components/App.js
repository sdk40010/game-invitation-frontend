import React from "react";
import { ProvideAuth } from "./auth/use-auth";
import { 
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import NavBar from "./NavBar";
import PrivateRoute from "./auth/PrivateRoute";
import Login from "./Login";
import Top from "./Top";


function App() {
    return (
        <ProvideAuth>
            <Router>
                <NavBar />
                <Switch>
                    <Route exact path="/">
                        <Top />
                    </Route>
                    <Route exact path="/login">
                        <Login />
                    </Route>
                    <PrivateRoute>
                        
                    </PrivateRoute>
                </Switch>
            </Router>
        </ProvideAuth>
    );
}

export default App;
