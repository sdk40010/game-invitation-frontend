import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";

import { useAuth } from "../auth/useAuth";
import useInvitationAPI from "../http/invitationAPI";
import useCommentAPI from "../http/commentAPI";
import useReplyAPI from "../http/replyAPI";
import useParticipationAPI from "../http/participationAPI";
import useErrors from "../utils/useErros";
import useLoading from "../utils/useLoading";
import { useSnackbar } from "../utils/useOpenState";

import EventEmitter from 'events';

import MainContainer from "../utils/MainContainer";
import Heading from "../utils/Heading";
import { CommentList } from "./Comment";
import SimpleMenu from "../utils/SimpleMenu";

import { makeStyles } from "@material-ui/core/styles";
import {
    Typography,
    Card,
    CardHeader,
    CardContent,
    Button,
    Avatar,
    Grid,
    Box,
    Chip,
    ListItemAvatar,
    ListItemText,
    Snackbar,
} from "@material-ui/core";
import { AvatarGroup } from "@material-ui/lab";


const useStyles = makeStyles((theme) => ({
    headerAction: {
        marginTop: 0,
        marginRight: 0
    },
    disabledButton: {
        backgroundColor: theme.palette.action.disabledBackground + " !important",
        color: theme.palette.text.secondary + " !important",
    },
    
    groupAvatar: {
        "&:hover": {
            transform: "scale(1.1)",
            zIndex: 100 + " !important"
        }
    },
    // アイコン用
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7)
    }
}));

/**
 * 募集閲覧ページ
 */
export default function ShowInvitation() {
    const auth = useAuth();
    const invitationAPI = useInvitationAPI();
    const commentAPI = useCommentAPI();
    const replyAPI = useReplyAPI();
    const participationAPI = useParticipationAPI();

    const pageError = useErrors(invitationAPI.error, commentAPI.error, replyAPI.error, participationAPI.error, auth.error);
    const loading = useLoading(invitationAPI.data, commentAPI.data);

    const { id } = useParams(); // 募集ID

    // 募集の取得
    useEffect(() => {
        (async () => {
            await invitationAPI.get(id);
        })();
    }, []);

    // コメント一覧の取得
    useEffect(() => {
        (async () => {
            await commentAPI.getAll(id);
        })();
    }, []);

    return (
        <MainContainer error={pageError} loading={loading} maxWidth="md">
            <>
                <Box mb={2}>
                    <InvitationCard
                        invitationAPI={invitationAPI}
                        participationAPI={participationAPI}
                    />
                </Box>

                <Box>
                    <Card>
                        <CardHeader 
                            title={<Typography variant="h6" component="h2">コメント</Typography>}
                        />
                        <CardContent>
                            <CommentList commentAPI={commentAPI} replyAPI={replyAPI} />
                        </CardContent>
                    </Card>
                </Box>
            </>
        </MainContainer>
    );
}

/**
 * 募集詳細カード
 */
function InvitationCard({invitationAPI, participationAPI}) {
    const invitation = invitationAPI.data;

    const auth = useAuth();

    const classes = useStyles();

    const snackbar = useSnackbar();

    // 募集タイトル
    const title = <Typography variant="h5" component="h1" paragraph>{invitation.title}</Typography>;
    const subHeader = invitation.createdAt;

    // 参加ボタン用
    const handleParticipate = async () => {
        const success1 = await participationAPI.post(invitation.id);
        // 参加者一覧を更新するために、募集を再取得する
        const success2 = await invitationAPI.get(invitation.id);
        if (success1 && success2) {
            snackbar.handleOpen("募集に参加しました。");
        }
    }
    const handleCancel = async () => {
        const success1 = await participationAPI.remove(invitation.id);
        const success2 = await invitationAPI.get(invitation.id);
        if (success1 && success2) {
            snackbar.handleOpen("募集への参加を取り消しました。");
        }
    }
    const isPoster = auth.user.id === invitation.userId;
    const participatedIn = invitation.participants.some(participant => auth.user.id === participant.id);
    const canParticipateIn = invitation.canParticipateIn;

    // 参加ボタン
    const participationButton 
        = isPoster ? <DisabledButton>主催者として参加済み</DisabledButton>
        : participatedIn ? <Button variant="contained" onClick={handleCancel}>参加済み</Button>
        : !canParticipateIn ? <DisabledButton>募集終了</DisabledButton>
        : <Button color="primary" variant="contained" onClick={handleParticipate}>参加する</Button>;

    // 募集の作成者
    const poster = (
        <Box mb={2}>
            <UserProfile user={invitation.user} />
        </Box>
    );

    // 募集詳細
    const content = (
        <>
            <Box mb={2}>
                <Grid container spacing={1}>
                    {invitation.tags.map((tag, i) => (
                        <Grid item key={i}>
                            <Chip label={tag.name} />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {invitation.description ? (
                <Box mb={2}>
                    <Heading>説明</Heading>
                    <Typography variant="body1">{invitation.description}</Typography>
                </Box>
            ) : (
                <></>
            )}

            <Box mb={2}>
                <Heading>時間</Heading>
                <Grid container spacing={1}>
                    <Grid item>
                        <Typography variant="body1">{invitation.startTime}</Typography>
                    </Grid>
                    <Grid item>〜</Grid>
                    <Grid item>
                        <Typography variant="body1">{invitation.endTime}</Typography>
                    </Grid>
                </Grid>
            </Box>

            <Box mb={2}>
                <Heading>定員</Heading>
                <Typography variant="body1">{invitation.capacity}人</Typography>
            </Box>

            <Box mb={2}>
                <Heading>参加者</Heading>
                <Box mt={1}>
                    <CustomAvatarGroup invitation={invitation} />
                </Box>
            </Box>

        </>
    );

    return (
        <Card>
            <Snackbar 
                anchorOrigin={{ vertical: "bottom", horizontal: "left"}}
                open={snackbar.open}
                message={snackbar.message}
                autoHideDuration={3000}
                onClose={snackbar.handleClose}
            />

            <CardHeader 
                title={title}
                subheader={subHeader}
                action={participationButton}
                classes={{ action: classes.headerAction }}
            />
            <CardContent>
                {poster}
                {content}
            </CardContent>
        </Card>
    );

}

/**
 * ユーザープロフィール
 */
export function UserProfile({user, iconSize, typographyVariant = "body1"}) {
    const auth = useAuth();

    const classes = useStyles();

    return (
        <Grid container spacing={1} alignItems="center">

            <Grid item>
                <Avatar alt={user.name} src={user.iconUrl} className={classes[iconSize] ?? ""} />
            </Grid>

            <Grid item xs>
                <Typography variant={typographyVariant}>{user.name}</Typography>
            </Grid>

            {auth.user.id !== user.id && (
                <Grid item>
                    <Button color="primary" variant="outlined">フレンド申請</Button>
                </Grid>
            )}

        </Grid>
    );
}

/**
 * 操作できないボタン
 * ボタンラベルの色を調整済み
 */
function DisabledButton({children}) {
    const classes = useStyles();

    return (
        <Button variant="contained" disabled classes={{ disabled: classes.disabledButton }}>
            {children}
        </Button>
    );
}

// 参加者一覧用
const ITEM_HEIGHT = 52;
const ITEM_PADDING_TOP = 8;

/**
 * 参加者一覧
 */
function CustomAvatarGroup(props) {
    const { invitation, max = 4 } = props;
    const participants = invitation.participants;

    const auth = useAuth();

    const classes = useStyles();

    // SimpleMenuに渡すイベントエミッター
    const eventEmitter = useMemo(() => new EventEmitter(), []);

    const handleClickShowMore = (event) => {
        eventEmitter.emit("clickShowMore", event);
    }

    // 参加者一覧用
    const menuItems = participants.map(participant => {
        const content = (
            <>
                <ListItemAvatar>
                    <Avatar alt={participant.name} src={participant.iconUrl} />
                </ListItemAvatar>
                <ListItemText
                    primary={participant.name}
                    secondary={invitation.userId === participant.id
                        ? `主催者・${participant.participation.createdAt}に参加`
                        : `${participant.participation.createdAt}に参加`
                    }
                />
            </>
        );

        return {
            content: content,
            onClick: () => {},
            disableTypography: true,
            link: `/users/${participant.id}`
        }
    });

    return (
        <>
            <AvatarGroup classes={{ avatar: classes.groupAvatar }}>
                {participants.slice(0, max).map(participant => (
                    <Avatar 
                        alt={participant.name}
                        src={participant.iconUrl}
                        key={participant.id}
                        component={Link}
                        to={`/users/${participant.id}`}
                    />


                ))}
                <Avatar onClick={handleClickShowMore}>
                    {`+${participants.length > max ? participants.length - max : 0}`}
                </Avatar>
            </AvatarGroup>

            <SimpleMenu 
                menuItems={menuItems}
                PaperProps={{ style: { maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP } }}
                eventProps={{ name: "clickShowMore", emitter: eventEmitter }}
            />
        </>
    );

}


