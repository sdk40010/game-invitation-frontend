import { Button } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./auth/use-auth";
import { AppBar, Typography, Toolbar } from "@material-ui/core"

export default function NavBar() {
    const auth = useAuth();
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6">
                    SITE NAME
                </Typography>
                { auth.user ? (
                    <>
                        <Link to="/invitations/new"><Button>新規作成</Button></Link>
                        <Link to="#">{auth.user.displayName}</Link>
                        <Button onClick={() => auth.logout()}>ログアウト</Button>
                    </>
                ) : (
                    <Link to="/login">ログイン</Link>
                )}
            </Toolbar>
        </AppBar>
    );
}
