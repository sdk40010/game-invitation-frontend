import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../auth/useAuth";
import useInvitationAPI from "../http/invitationAPI";
import useCommentAPI from "../http/commentAPI";
import useReplyAPI from "../http/replyAPI";
import useParticipationAPI from "../http/participationAPI";
import useErrors from "../utils/useErros";
import useLoading from "../utils/useLoading";

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
    ListItemText
} from "@material-ui/core";
import { AvatarGroup } from "@material-ui/lab";


const useStyles = makeStyles((theme) => ({
    headerAction: {
        marginTop: 0,
        marginRight: 0
    },
    groupAvatar: {
        "&:hover": {
            transform: "scale(1.1)",
            zIndex: 100 + " !important"
        }
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
                        invitation={invitationAPI.data}
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
function InvitationCard({invitation, participationAPI}) {
    const auth = useAuth();

    const classes = useStyles();

    // 募集タイトル
    const title = <Typography variant="h5" component="h1" paragraph>{invitation.title}</Typography>;
    const subHeader = invitation.createdAt;

    // 参加ボタン
    const handleParticipate = async () => {
        const success = await participationAPI.post(invitation.id);
    }
    const handleCancel = async () => {
        const success = await participationAPI.remove(invitation.id);
    }
    const participated = invitation.participants.some(participant => auth.user.id === participant.id);
    const participationButton = participated
        ? <Button variant="contained">参加済み</Button>
        : <Button color="primary" variant="contained">参加する</Button>;

    // 募集の作成者
    const poster = (
        <Box mb={2}>
            <Grid container spacing={1} alignItems="center">

                <Grid item>
                    <Avatar alt={invitation.user.name} src={invitation.user.iconUrl} />
                </Grid>

                <Grid item xs>
                    <Typography variant="body1">{invitation.user.name}</Typography>
                </Grid>

                {auth.user.id !== invitation.userId && (
                    <Grid item>
                        <Button color="primary" variant="outlined">フレンド申請</Button>
                    </Grid>
                )}

            </Grid>
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
                    <CustomAvatarGroup users={invitation.participants} />
                </Box>
            </Box>

        </>
    );

    return (
        <Card>
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

const ITEM_HEIGHT = 52;
const ITEM_PADDING_TOP = 8;

/**
 * 参加者のアイコン一覧
 */
function CustomAvatarGroup(props) {
    const { users, max = 4 } = props;

    const classes = useStyles();

    // SimpleMenuに渡すイベントエミッター
    const eventEmitter = useMemo(() => new EventEmitter(), []);

    const handleClickShowMore = (event) => {
        eventEmitter.emit("clickShowMore", event);
    }

    // 参加者一覧用
    const menuItems = users.map(user => {
        const content = (
            <>
                <ListItemAvatar>
                    <Avatar alt={user.name} src={user.iconUrl} />
                </ListItemAvatar>
                <ListItemText primary={user.name} />
            </>
        );

        return {
            content: content,
            onClick: () => {},
            disableTypography: true
        }
    });

    return (
        <>
            <AvatarGroup classes={{ avatar: classes.groupAvatar }}>
                {users.slice(0, max).map(participant => (
                    <Avatar alt={participant.name} src={participant.iconUrl} key={participant.id} />
                ))}
                <Avatar onClick={handleClickShowMore}>
                    {`+${users.length > max ? users.length - max : 0}`}
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


