import { useAuth } from "../auth/useAuth";

import { useSnackbar } from "../utils/useOpenState";

import SimpleLink from "../utils/SimpleLink";
import CustomChip from "../utils/CustomChip";

import { makeStyles } from "@material-ui/core/styles";
import {
    Typography,
    Button,
    Avatar,
    Grid,
    Box,
    Snackbar,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    // アイコン用
    xl: {
        width: theme.spacing(7),
        height: theme.spacing(7)
    }
}));

/**
 * ユーザープロフィール
 */
 export default function UserProfile(props) {
    const {
        user,
        iconSize,
        typographyVariant = "body1",
        snackbar,
        onFollow,
        onUnfollow,
        enableStopPropagation = false
    } = props;

    const auth = useAuth();

    const classes = useStyles();

    // const snackbar = useSnackbar();

    // フォロー
    const handleFollow = async (event) => {
        stopPropagation(event);
        const success = await onFollow();
        if (success) {
            snackbar.handleOpen(`${user.name}をフォローしました`);
            console.log("open");
        }
    }

    // フォロー取り消し
    const handleUnfollow = async (event) => {
        stopPropagation(event);
        const success = await onUnfollow();
        if (success) {
            snackbar.handleOpen(`${user.name}のフォローを取り消しました`);
            console.log("open");
        }
    }

    const handleLinkClick = (event) => {
        stopPropagation(event);
    }

    const stopPropagation = (event) => {
        if (enableStopPropagation) {
            event.stopPropagation();
        }
    }

    return (
        <Grid container spacing={1} alignItems="center">

            <Grid item>
                <SimpleLink to={`/users/${user.id}`} display="block" onClick={handleLinkClick}>
                    <Avatar
                        alt={user.name}
                        src={user.iconUrl}
                        className={classes[iconSize] ?? ""}
                    />
                </SimpleLink>
            </Grid>

            <Grid item xs>
                <Box mt={-.5}>
                    <Grid container alignItems="center">
                        <Grid item>
                            <SimpleLink to={`/users/${user.id}`} display="inline-block" onClick={handleLinkClick}>
                                <Typography variant={typographyVariant}>{user.name}</Typography>
                            </SimpleLink>
                        </Grid>
                        <Grid>
                            {Boolean(user.isFollower) && 
                                <CustomChip
                                    variant="outlined"
                                    size="small"
                                    label="フォローされています"
                                    textSecondary={true}
                                    ml={1}
                                />
                            }
                        </Grid>
                    </Grid>

                    <Typography variant="body2" color="textSecondary">
                        {[
                            `投稿 ${user.invitationsPostedCount}`,
                            `参加 ${user.invitationsParticipatedInCount}`,
                            `フォロー ${user.followingsCount}`,
                            `フォロワー ${user.followersCount}`
                        ].join("　")}
                    </Typography>
                </Box>
            </Grid>

            {auth.user.id !== user.id && (
                <Grid item>
                    {user.isFollowing ? (
                        <Button color="primary" variant="outlined" onClick={handleUnfollow} component="span">
                            フォロー中
                        </Button>
                    )
                    : (
                        <Button variant="outlined" onClick={handleFollow} component="span">フォロー</Button>
                    )}
                    <Snackbar 
                        anchorOrigin={{ vertical: "bottom", horizontal: "left"}}
                        open={snackbar.open}
                        message={snackbar.message}
                        autoHideDuration={3000}
                        onClose={snackbar.handleClose}
                    />
                </Grid>
            )}

        </Grid>
    );
}