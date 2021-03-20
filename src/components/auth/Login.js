import React from "react";
import { Redirect, useLocation } from "react-router-dom";

import { useAuth } from "./useAuth";

import MainContainer from "../utils/MainContainer";

import { makeStyles } from "@material-ui/core/styles";
import { 
    Card,
    CardHeader,
    CardContent,
    Button,
    Typography,
    Grid
} from "@material-ui/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";


const useStyles = makeStyles((theme) => ({
    card: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    cardContent: {
        width: "100%"
    },
    buttonLabel: {
        margin: "0 auto",
    },
    endIcon: {
        width: "22px",
        height: "22px"
    }
}));

export default function Login() {
    const auth = useAuth();
    const location = useLocation();
    const from = location.state ? location.state.from : "/";
    const classes = useStyles();

    const handleLogin = () => {
        auth.login();
    }

    if (auth.user) {
        return <Redirect to={from} />;
    }

    return (
        <MainContainer maxWidth="xs">
            <Card className={classes.card}>
                <CardHeader 
                    title={<Typography variant="h6" component="h1">ログイン</Typography>}
                />
                <CardContent className={classes.cardContent}>
                    <Grid container justify="center">
                        <Grid item xs={10}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleLogin}
                                startIcon={<FontAwesomeIcon icon={faGoogle} />}
                                endIcon={<span className={classes.endIcon} />} // ラベルを中央に配置するために空のendIconを設定する
                                fullWidth
                                size="large"
                            >
                                <span className={classes.buttonLabel}>Gooleでログイン</span>
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </MainContainer>
    );
    
}