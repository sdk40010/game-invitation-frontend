import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../auth/useAuth";
import useInvitationAPI from "../http/invitationAPI";
import useCommentAPI from "../http/commentAPI";
import useReplyAPI from "../http/replyAPI";
import useParticipationAPI from "../http/participationAPI";
import useFollowingAPI from "../http/followingAPI";
import { useSnackbar } from "../utils/useOpenState";

import EventEmitter from 'events';

import MainContainer from "../utils/MainContainer";
import Heading from "../utils/Heading";
import { CommentList } from "./Comment";
import SimpleMenu from "../utils/SimpleMenu";
import SimpleLink from "../utils/SimpleLink";
import UserProfile from "./UserProfile"

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
    defaultButton: {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.type === "light"
            ? theme.palette.grey[300]
            : theme.palette.grey[600],
        "&:hover": {
            backgroundColor: theme.palette.type === "light"
                ? theme.palette.grey["A100"]
                : theme.palette.grey[700]
        }
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
    const { id } = useParams(); // 募集ID

    const invitationAPI = useInvitationAPI(id);
    const commentAPI = useCommentAPI();
    const replyAPI = useReplyAPI();
    const participationAPI = useParticipationAPI();
    const followingAPI = useFollowingAPI();

    const errors = [
        invitationAPI.error,
        commentAPI.error,
        replyAPI.error,
        participationAPI.error,
        followingAPI.error,
    ];
    const resources = [invitationAPI.data, commentAPI.data];

    
    useEffect(() => {
        (async () => {
            await invitationAPI.get();　// 募集の取得
            await commentAPI.getAll(id);　// コメント一覧の取得
        })();
    }, []);

    return (
        <MainContainer errors={errors} resources={resources} maxWidth="md">
            <>
                <Box mb={2}>
                    <InvitationCard
                        invitationAPI={invitationAPI}
                        participationAPI={participationAPI}
                        followingAPI={followingAPI}
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
function InvitationCard({invitationAPI, participationAPI, followingAPI}) {
    const invitation = invitationAPI.data;

    const auth = useAuth();

    const classes = useStyles();

    const snackbar = useSnackbar();

    // 募集タイトル
    const title = <Typography variant="h5" component="h1" paragraph>{invitation.title}</Typography>;
    const subHeader = invitation.createdAt;

    // 募集への参加
    const handleParticipate = async () => {
        const success1 = await participationAPI.post(invitation.id);
        // 参加者一覧を更新するために、募集を再取得する
        const success2 = await invitationAPI.get();
        if (success1 && success2) {
            snackbar.handleOpen("募集に参加しました");
        }
    }

    // 参加の取り消し
    const handleCancel = async () => {
        const success1 = await participationAPI.remove(invitation.id);
        const success2 = await invitationAPI.get();
        if (success1 && success2) {
            snackbar.handleOpen("募集への参加を取り消しました");
        }
    }
    const isPoster = invitation.isPoster;
    const participatedIn = invitation.participants.some(participant => auth.user.id === participant.id);
    const canParticipateIn = invitation.canParticipateIn;

    // 参加ボタン
    const participationButton 
        = isPoster ? <DisabledButton>主催者として参加済み</DisabledButton>
        : participatedIn ?
            <Button variant="contained" onClick={handleCancel} classes={{ contained: classes.defaultButton }}>
                参加済み
            </Button>
        : !canParticipateIn ? <DisabledButton>募集終了</DisabledButton>
        : <Button color="primary" variant="contained" onClick={handleParticipate}>参加する</Button>;

    // フォロー
    const handleFollow = async () => {
        const success1 = await followingAPI.post(invitation.user.id);
        // ユーザープロフィールを更新するために、募集をを再取得する
        const success2 = await invitationAPI.get();
        return Boolean(success1 && success2);
    }

    // フォロー取り消し
    const handleUnfollow = async () => {
        const success1 = await followingAPI.remove(invitation.user.id);
        const success2 = await invitationAPI.get();
        return Boolean(success1 && success2);
    }

    // 募集の作成者
    const poster = (
        <Box mb={2}>
            <UserProfile
                user={invitation.user}
                onFollow={handleFollow}
                onUnfollow={handleUnfollow}
                snackbar={snackbar}
            />
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
                <Heading>開始時刻</Heading>
                <Grid container spacing={1}>
                    <Grid item>
                        <Typography variant="body1">{invitation.startIn}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1" color="textSecondary">
                            {`( ${invitation.startTime} )`}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>

            <Box mb={2}>
                <Heading>時間</Heading>
                <Grid container spacing={1}>
                    <Grid item>
                        <Typography variant="body1">{invitation.interval}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1" color="textSecondary">
                            {`( ${invitation.startTime} 〜 ${invitation.endTime} )`}
                        </Typography>
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
const ITEM_HEIGHT = 68;
const ITEM_PADDING_TOP = 8;

/**
 * 参加者一覧
 */
function CustomAvatarGroup(props) {
    const { invitation, max = 4 } = props;
    const participants = invitation.participants;

    const classes = useStyles();

    // SimpleMenuに渡すイベントエミッター
    const eventEmitter = useMemo(() => new EventEmitter(), []);
    const eventName = "clickShowMore";
    const handleClickShowMore = (event) => {
        eventEmitter.emit(eventName, event);
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
                        component={SimpleLink}
                        to={`/users/${participant.id}`}
                    />


                ))}
                <Avatar onClick={handleClickShowMore}>
                    {`+${participants.length > max ? participants.length - max : 0}`}
                </Avatar>
            </AvatarGroup>

            <SimpleMenu 
                menuItems={menuItems}
                PaperProps={{ style: { maxHeight: ITEM_HEIGHT * 4 + ITEM_PADDING_TOP } }}
                eventProps={{ name: eventName, emitter: eventEmitter }}
            />
        </>
    );

}


