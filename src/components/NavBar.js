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
    // siteName: {
    //     flexGrow: 1,
    // },
    button: {
        backgroundColor: theme.palette.common.white,
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        "&:hover": {
            backgroundColor: theme.palette.grey[300]
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

                {/* <Box className={classes.siteName}>
                    <SimpleLink to="/" display="inline-block">
                        <Typography variant="h6" component="span">SITE NAME</Typography>
                    </SimpleLink>
                </Box>

                <SearchField />

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
                )} */}

                <Grid container alignItems="center">

                    <Grid item>
                        <Box mr={12}>
                            <SimpleLink to="/" display="inline-block">
                                <Typography variant="h6" component="span">SITE NAME</Typography>
                            </SimpleLink>
                        </Box>
                    </Grid>

                <Grid item xs>
                    <SearchFormPopover />
                </Grid>

                <Grid item>
                    <IconButton color="inherit" onClick={onToggleTheme}>
                        {theme.palette.type === "light"
                            ? <Brightness2 />
                            : <Brightness7 />
                        }
                    </IconButton>
                </Grid>
                

                {auth.user ? (
                    <>
                        <Grid item>
                            <SimpleLink to="/invitations/new">
                                <Button variant="contained" className={classes.button}>新規作成</Button>
                            </SimpleLink>
                        </Grid>
                            
                        <Grid item>
                            <SimpleMenu
                                icon={<Avatar alt={auth.user.name} src={auth.user.iconUrl} />}
                                menuItems={menuItems}
                            />
                        </Grid>
                    </>
                ) : (
                    <Grid item>
                        <SimpleLink to="/login">
                            <Button variant="contained" className={classes.button}>ログイン</Button>
                        </SimpleLink>
                    </Grid>
                    
                )}
                </Grid>
            </Toolbar>
        </AppBar>
    );
}
