import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../auth/useAuth";
import useInvitationAPI from "../http/invitationAPI";
import useCommentAPI from "../http/commentAPI";
import useReplyAPI from "../http/replyAPI";
import useErrors from "../utils/useErros";
import useLoading from "../utils/useLoading";

import MainContainer from "../utils/MainContainer";
import Heading from "../utils/Heading";
import { CommentPoster, CommentList } from "./Comment";

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
} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
    headerAction: {
        marginTop: 0,
        marginRight: 0
    },
}));


/**
 * 募集閲覧ページ
 */
export default function ShowInvitation() {
    const auth = useAuth();
    const invitationAPI = useInvitationAPI();
    const commentAPI = useCommentAPI();
    const replyAPI = useReplyAPI();

    const pageError = useErrors(invitationAPI.error, commentAPI.error, replyAPI.error, auth.error);
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

    // コメントの投稿
    const handleCommentSubmit = async (input) => {
        await commentAPI.post(input, id);
    }

    return (
        <MainContainer error={pageError} loading={loading} maxWidth="md">
            <>
                <Box mb={2}>
                    <InvitationCard invitation={invitationAPI.data}/>
                </Box>

                <Box>
                    <Card>
                        <CardHeader 
                            title={<Typography variant="h6" component="h2">コメント</Typography>}
                        />
                        <CardContent>
                            <Box mb={4}>
                                <CommentPoster
                                    onCommentSubmit={handleCommentSubmit}
                                    inputProps={{ name: "comment", label:"コメント", defaultValue: "" }}
                                    snackbarMessage="コメントを投稿しました。"
                                />
                            </Box>

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
function InvitationCard({invitation}) {
    const classes = useStyles();

    const title = <Typography variant="h5" component="h1" paragraph>{invitation.title}</Typography>;
    const subHeader = invitation.createdAt;
    const participationButton = <Button color="primary" variant="contained">参加する</Button>;

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

                <Grid item>
                    <Button color="primary" variant="outlined">フレンド申請</Button>
                </Grid>

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


