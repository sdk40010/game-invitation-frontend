import React from "react";
import { Redirect, useLocation } from "react-router-dom";
import { useAuth } from "./auth/use-auth";
import { 
    Card,
    CardHeader,
    CardContent,
    Button,
    Typography
} from "@material-ui/core";


export default function Login() {
    const auth = useAuth();
    const location = useLocation();
    const from = location.state ? location.state.from : "/";

    return(
        auth.user ? (
            <Redirect to={from} />
        ) : (
            <Card>
                <CardHeader>
                    <Typography>ログイン</Typography>
                </CardHeader>
                <CardContent>
                    <Button color="inherit" onClick={() => auth.login()}>ログイン</Button>
                </CardContent>
            </Card>
        )
    );
}