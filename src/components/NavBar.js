import { Button } from "@material-ui/core";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./auth/use-auth";
import { 
    AppBar,
    Typography,
    Toolbar,
} from "@material-ui/core"

export default function NavBar() {
    const auth = useAuth();
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6">
                    SITE NAME
                </Typography>
                { auth.user ? (
                    <Fragment>
                        <Link to="#">{auth.user.displayName}</Link>
                        <Button color="inherit"　onClick={() => auth.logout()}>ログアウト</Button>
                    </Fragment>
                ) : (
                    <Link to="/login">ログイン</Link>
                )}
            </Toolbar>
        </AppBar>
    );
}
