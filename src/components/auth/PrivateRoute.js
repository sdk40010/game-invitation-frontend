import { useAuth } from "./useAuth";
import { Route, Redirect } from "react-router-dom";

export default function PrivateRoute({ children, ...rest }) {
    const auth = useAuth();
    return (
        <Route
            {...rest}
            render={({ location }) =>
                auth.user ? (
                    children
                ) : (
                    <Redirect to={{ pathname: "/login", state: { from: location } }} />
                )
            }
        />
    );
}