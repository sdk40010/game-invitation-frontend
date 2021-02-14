import React from "react";
import { Redirect, useLocation } from "react-router-dom";
import { useAuth } from "./auth/use-auth";
import MainContainer from "./utils/MainContainer";
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

    if (auth.user) {
        return <Redirect to={from} />;
    } else {
        return (
            <MainContainer maxWidth="sm">
                <Card>
                    <CardHeader 
                        title={<Typography variant="h6" component="h1">ログイン</Typography>}
                    />
                    <CardContent>
                        <Button variant="outlined" color="primary" onClick={() => auth.login()}>Gooleでログイン</Button>
                    </CardContent>
                </Card>
            </MainContainer>
        );
    }
}