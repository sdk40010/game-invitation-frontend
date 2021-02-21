import React from "react";
import { Redirect, useLocation } from "react-router-dom";
import { useAuth } from "./use-auth";
import MainContainer from "../utils/MainContainer";
import { 
    Card,
    CardHeader,
    CardContent,
    Button,
    Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    }
}));

export default function Login() {
    const auth = useAuth();
    const location = useLocation();
    const from = location.state ? location.state.from : "/";
    const classes = useStyles();

    if (auth.user) {
        return <Redirect to={from} />;
    } else {
        return (
            <MainContainer error={auth.error} maxWidth="xs">
                <Card className={classes.root}>
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