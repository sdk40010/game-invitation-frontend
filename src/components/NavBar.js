import React from "react";
import { Link } from "react-router-dom";

import { useAuth } from "./auth/useAuth";

import SimpleMenu from "./utils/SimpleMenu";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
    AppBar,
    Typography,
    Toolbar,
    Button,
    Avatar,
    Box,
    IconButton,
} from "@material-ui/core";
import {Brightness2, Brightness7} from "@material-ui/icons";


const useStyles = makeStyles((theme) => ({
    appBar: {
        backgroundColor: theme.palette.type === "light"
            ? theme.palette.primary.main
            : theme.palette.background.default
    },
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
    },
    iconButton: {
        color: theme.palette.common.white
    }
}));

export default function NavBar({eventEmitter}) {
    const auth = useAuth();

    const theme = useTheme();

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

    const handleClick = () => eventEmitter.emit("toggleTheme");

    return (
        <AppBar className={classes.appBar}>
            <Toolbar>
                <Box className={classes.siteName}>
                    <Link to="/" className={classes.link}>
                        <Typography variant="h6" component="span">SITE NAME</Typography>
                    </Link>
                </Box>

                <IconButton className={classes.iconButton} onClick={handleClick}>
                    {theme.palette.type === "light"
                        ? <Brightness2 />
                        : <Brightness7 />
                    }
                </IconButton>

                {auth.user ? (
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
