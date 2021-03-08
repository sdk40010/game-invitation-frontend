import { Link } from "react-router-dom";

import { useAuth } from "./auth/useAuth";

import SimpleMenu from "./utils/SimpleMenu";
import SimpleLink from "./utils/SimpleLink";

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
import { Brightness2, Brightness7 } from "@material-ui/icons";


const useStyles = makeStyles((theme) => ({
    appBar: {
        backgroundColor: theme.palette.type === "light"
            ? theme.palette.primary.main
            : theme.palette.background.default
    },
    siteName: {
        flexGrow: 1,
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

export default function NavBar({onToggleTheme}) {
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
    ];

    return (
        <AppBar className={classes.appBar}>
            <Toolbar>
                <Box className={classes.siteName}>
                    <SimpleLink to="/">
                        <Typography variant="h6" component="span">SITE NAME</Typography>
                    </SimpleLink>
                </Box>

                <IconButton className={classes.iconButton} onClick={onToggleTheme}>
                    {theme.palette.type === "light"
                        ? <Brightness2 />
                        : <Brightness7 />
                    }
                </IconButton>

                {auth.user ? (
                    <>
                        <SimpleLink to="/invitations/new">
                            <Button variant="contained" className={classes.button}>新規作成</Button>
                        </SimpleLink>

                        <SimpleMenu
                            icon={<Avatar alt={auth.user.name} src={auth.user.iconUrl} />}
                            menuItems={menuItems}
                        />
                    </>
                ) : (
                    <SimpleLink to="/login">
                        <Button variant="contained" className={classes.button}>ログイン</Button>
                    </SimpleLink>
                )}

            </Toolbar>
        </AppBar>
    );
}
