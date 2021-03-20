import { useAuth } from "./auth/useAuth";

import SimpleMenu from "./utils/SimpleMenu";
import SimpleLink from "./utils/SimpleLink";
import SearchFormPopover from "./search/SearchFormPopover";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
    AppBar,
    Typography,
    Toolbar,
    Grid,
    Button,
    Avatar,
    IconButton,
} from "@material-ui/core";
import { Brightness2, Brightness7 } from "@material-ui/icons";


const useStyles = makeStyles((theme) => ({
    appBar: {
        backgroundColor: theme.palette.type === "light"
            ? theme.palette.primary.main
            : theme.palette.background.default,
        color: theme.palette.common.white,
    },
    button: {
        backgroundColor: theme.palette.type === "light"
            ? theme.palette.primary.contrastText
            : theme.palette.primary.main,
        color: theme.palette.type === "light"
            ? theme.palette.primary.main
            : theme.palette.primary.contrastText,
        "&:hover": {
            backgroundColor: theme.palette.type === "light"
                ? theme.palette.grey[300]
                : theme.palette.primary.dark
        }
    },
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
                link: `/users/${auth.user?.id}`
            },
        ];

    return (
        <AppBar className={classes.appBar}>
            <Toolbar>
                <Grid container alignItems="center" justify="space-between" wrap="nowrap">

                    <Grid item>
                        <SimpleLink to="/" display="inline-block">
                            <Typography variant="h6" component="span">SITE NAME</Typography>
                        </SimpleLink>
                    </Grid>

                    <Grid item xs={6}>
                        <SearchFormPopover />
                    </Grid>

                    <Grid item>
                        <IconButton color="inherit" onClick={onToggleTheme}>
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
                    </Grid>

                </Grid>
            </Toolbar>
        </AppBar>
    );
}
