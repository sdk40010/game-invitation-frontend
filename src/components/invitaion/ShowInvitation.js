import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../auth/useAuth";
import useInvitationAPI from "../http/invitationAPI";
import useCommentAPI from "../http/commentAPI";
import useErrors from "../utils/useErros";

import { useForm, useWatch } from "react-hook-form";

import MainContainer from "../utils/MainContainer";
import CenteredCircularProgress from "../utils/CenteredCircularProgress";
import Heading from "../utils/Heading";
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
    TextField,
    Snackbar,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    headerAction: {
        marginTop: 0,
        marginRight: 0
    },
    posterContainer: {
        marginBottom: theme.spacing(2)
    },
    commentItem: {
        overflowWrap: "break-word"
    }
}));

/**
 * 募集閲覧ページ
 */
export default function ShowInvitation() {
    const auth = useAuth();
    const invitationAPI = useInvitationAPI();
    const commentAPI = useCommentAPI();
    const pageError = useErrors(invitationAPI.error, commentAPI.error, auth.error);

    const { id } = useParams();

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
    const onCommentSubmit = (input) => {
        commentAPI.post(input, id);
    }

    return (
        <MainContainer error={pageError} maxWidth="md">
            {invitationAPI.data ? (
                <>
                    <Box mb={2}>
                        <InvitationCard invitation={invitationAPI.data}/>
                    </Box>

                    <Box>
                        <Card>
                            <CardHeader 
                                title={<Typography variant="h6" component="h2">コメント</Typography> }
                            />
                            <CardContent>
                                <CommentPoser onCommentSubmit={onCommentSubmit} />
                                <CommentList comments={commentAPI.data} />
                            </CardContent>
                        </Card>
                    </Box>
                </>
            ) : (
                <CenteredCircularProgress />
            )}
        </MainContainer>
    );
}

/**
 * 募集詳細カード
 */
function InvitationCard({invitation}) {
    const classes = useStyles();

    const title = <Typography variant="h5" component="h1" paragraph>{invitation.title}</Typography>;
    const subHeader = `${invitation.createdAt}に投稿`;
    const participationButton = <Button color="primary" variant="contained">参加する</Button>;

    // 募集の作成者
    const poster = (
        <Grid
            container
            spacing={1}
            alignItems="center"
            className={classes.posterContainer}
        >

            <Grid item>
                <Avatar
                    alt={invitation.user.name}
                    src={invitation.user.iconUrl}
                />
            </Grid>

            <Grid item xs>
                <Typography variant="body1">{invitation.user.name}</Typography>
            </Grid>

            <Grid item>
                <Button color="primary" variant="outlined">フレンド申請</Button>
            </Grid>

        </Grid>
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

/**
 * コメント投稿フォーム
 */
function CommentPoser({onCommentSubmit}) {
    const { register, control, handleSubmit, setValue } = useForm();
    const comment = useWatch({ name: "comment", control });

    const [open, setOpen] = useState(false);

    const onSubmit = (input) => {
        onCommentSubmit(input);
        setValue("comment", "");
        setOpen(true);
    }

    return (
        <Box mb={4}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={1} alignItems="center">

                    <Grid item xs>
                        <TextField
                            name="comment"
                            label="コメントを入力"
                            variant="outlined"
                            inputRef={register({
                                minLength: { value: 1, message: "コメントには1文字以上の文字列を指定してください。"}
                            })}
                            fullWidth
                            size="small"
                            multiline
                            rowsMax={5}
                        />
                    </Grid>

                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={!comment && true}
                        >
                            投稿
                        </Button>
                        <Snackbar
                            anchorOrigin={{ vertical: "bottom", horizontal: "left"}}
                            open={open}
                            message="コメントが投稿されました。"
                            autoHideDuration={3000}
                            onClose={() => setOpen(false)}
                        />
                    </Grid>

                </Grid>
            </form>
        </Box>
    );
}

/**
 * コメント一覧
 */
function CommentList({comments}) {
    const classes = useStyles();

    return (
        comments.map((comment, i) => (
            <Box mb={2} key={i}>
                <Grid container spacing={1} wrap="nowrap">
                    <Grid item>
                        <Avatar
                            alt={comment.user.name}
                            src={comment.user.iconUrl}
                        />
                    </Grid>

                    <Grid item zeroMinWidth>
                        <Box pl={1} mt={-1}> {/** mt=-1はアイコンと高さを揃えるため */}
                            <Grid container spacing={1}>
                                <Grid item>
                                    <Typography variant="body2">{comment.user.name}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body2" color="textSecondary">{comment.createdAt}</Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={1}>
                                <Grid item zeroMinWidth className={classes.commentItem}>
                                    <Typography>{comment.content}</Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item >
                                    <Typography variant="body2" color="textSecondary">返信を表示</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body2" color="textSecondary">返信</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body2" color="textSecondary">削除</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    
                </Grid>
            </Box>
        ))
    );
}

