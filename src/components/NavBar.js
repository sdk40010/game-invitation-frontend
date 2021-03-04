import React from "react";
import { Link } from "react-router-dom";

import { useAuth } from "./auth/useAuth";

import SimpleMenu from "./utils/SimpleMenu";
import { makeStyles } from "@material-ui/core/styles";
import {
    AppBar,
    Typography,
    Toolbar,
    Button,
    Avatar,
} from "@material-ui/core"


const useStyles = makeStyles((theme) => ({
    siteName: {
        flexGrow: 1,
    },
    link: {
        textDecoration: "none",
        color: theme.palette.common.white,
        display: "inline-block"
    },
    button: {
        backgroundColor: theme.palette.common.white,
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        "&:hover": {
            backgroundColor: theme.palette.grey[300]
        }
    }
}));

export default function NavBar() {
    const auth = useAuth();

    const classes = useStyles();

    const menuItems = [
        {
            content: "ログアウト",
            onClick: auth.logout
        },
        {
            content: "マイページ",
            onClick: () => {}
        },
        {
            content: "設定",
            onClick: () => {}
        }
    ]

    return (
        <AppBar>
            <Toolbar>
                <div className={classes.siteName}>
                    <Link to="/" className={classes.link}>
                        <Typography variant="h6" component="span">SITE NAME</Typography>
                    </Link>
                </div>

                { auth.user ? (
                    <>
                        <Link to="/invitations/new" className={classes.link}>
                            <Button variant="contained" className={classes.button}>新規作成</Button>
                        </Link>

                        <SimpleMenu
                            icon={<Avatar alt={auth.user.name} src={auth.user.iconUrl} />}
                            menuItems={menuItems}
                        />
                    </>
                ) : (
                    <Link to="/login" className={classes.link}>
                        <Button variant="contained" className={classes.button}>ログイン</Button>
                    </Link>
                )}

            </Toolbar>
        </AppBar>
    );
}
