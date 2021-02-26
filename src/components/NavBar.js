import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./auth/useAuth";
import { makeStyles } from "@material-ui/core/styles";
import {
    AppBar,
    Typography,
    Toolbar,
    Button,
    Avatar,
    IconButton,
    Menu,
    MenuItem
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
    const [anchorEl, setAnchorEl] = useState(null);
    const auth = useAuth();
    const classes = useStyles();

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    }

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
                        <IconButton onClick={handleClick}>
                            <Avatar
                                alt={auth.user.name}
                                src={auth.user.iconUrl}
                            />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => {
                                handleClose();
                                auth.logout();
                            }}>
                                <Typography component="span" variant="button">ログアウト</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <Typography component="span" variant="button">マイページ</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <Typography component="span" variant="button">設定</Typography>
                            </MenuItem>
                        </Menu>
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
