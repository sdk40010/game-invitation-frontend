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
    TextField,
    Snackbar,
    Collapse,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    DialogContentText
} from "@material-ui/core";
import { MoreVert } from '@material-ui/icons';

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
    },
    commentPosterButtonWrapper: {
        "& > *:not(:last-child)": {
            marginRight: theme.spacing(1)
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
    const handleCommentSubmit = async (input) => {
        await commentAPI.post(input, id);
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
                                <Box mb={4}>
                                    <CommentPoser
                                        onCommentSubmit={handleCommentSubmit}
                                        buttonLabel="投稿"
                                        snackbarMessage="コメントが投稿されました。"
                                    />
                                </Box>
                                <CommentList commentAPI={commentAPI} />
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
    const subHeader = invitation.createdAt;
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
 * コメント投稿・更新フォーム
 */
function CommentPoser(props) {
    const {
        onCommentSubmit,
        defaultInput = "",
        onCancel = () => {},
        buttonLabel,
        snackbarMessage = "",
    } = props;

    const auth = useAuth();

    const classes = useStyles();

    const defaultValues = { comment: defaultInput };
    const { register, control, handleSubmit, setValue } = useForm({defaultValues});
    const comment = useWatch({ name: "comment", control });

    // 投稿・キャンセルボタン用
    const collapse = useOpenState();
    const handleCancelClick = () => {
        onCancel();
        collapse.handleClose();
    }

    // 投稿の完了を通知するためのスナックバー用
    const snackbar = useOpenState();

    // コメントの投稿・更新
    const onSubmit = async (input) => {
        await onCommentSubmit(input);
        setValue("comment", "");
        collapse.handleClose();
        snackbar.handleOpen();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1}>

                <Grid container item>

                    <Grid item>
                        <Avatar alt={auth.user.name} src={auth.user.iconUrl} />
                    </Grid>

                    <Grid item xs>
                        <Box pl={1}>
                            <TextField
                                name="comment"
                                placeholder="コメントを入力"
                                variant="outlined"
                                inputRef={register({
                                    minLength: { value: 1, message: "コメントには1文字以上の文字列を指定してください。"}
                                })}
                                fullWidth
                                size="small"
                                multiline
                                onFocus={collapse.handleOpen}
                            />
                        </Box>
                    </Grid>

                </Grid>

                <Grid container item spacing={2} justify="flex-end">

                    <Grid item>
                        <Collapse
                            in={collapse.open}
                            timeout={0}
                            unmountOnExit
                            classes={{
                                wrapperInner: classes.commentPosterButtonWrapper
                            }}
                        >
                            <Button color="primary" onClick={handleCancelClick}>
                                キャンセル
                            </Button>

                            <Button variant="contained" color="primary" type="submit" disabled={!comment && true}>
                                {buttonLabel}
                            </Button>
                        </Collapse>
                    </Grid>

                </Grid>

            </Grid>

            {snackbarMessage ? (
                <Snackbar
                    anchorOrigin={{ vertical: "bottom", horizontal: "left"}}
                    open={snackbar.open}
                    message={snackbarMessage}
                    autoHideDuration={3000}
                    onClose={snackbar.handleClose}
                />
            ) : (
                <></>
            )}
        </form>
    );
}

/**
 * コメント一覧
 */
function CommentList({commentAPI}) {
    return (
        <>
            {commentAPI.data.map((comment, i) => (
                <CommentListItem
                    comment={comment}
                    commentAPI={commentAPI}
                    key={i}
                />
            ))}
        </>
    );
}

/**
 * コメント一覧アイテム
 */
function CommentListItem({comment, commentAPI}) {
    const auth = useAuth();

    const classes = useStyles();

    // コメント更新フォーム用
    const collapse = useOpenState();

    // 更新・削除の完了を通知するためのスナックバー用
    const snackbar = useOpenState();
    const [message, setMessage] = useState("");

    // 削除の確認をするダイアログ用
    const dialog = useOpenState();

    // コメントの操作メニュー用
    const menuItems = [
        {
            label: "編集",
            onClick: collapse.handleOpen
        },
        {
            label: "削除",
            onClick: dialog.handleOpen
        }
    ];

    // コメントの更新
    const handleCommentSubmit = async (input) => {
        const success = await commentAPI.update(input, comment.invitationId, comment.id);
        collapse.handleClose();

        if (!success) return;

        setMessage("コメントが更新されました。");
        snackbar.handleOpen();
    }

    // コメントの削除
    const handleCommentDelete = async () => {
        const success = await commentAPI.remove(comment.invitationId, comment.id);
        dialog.handleClose();

        if (!success) return;

        setMessage("コメントが削除されました。");
        snackbar.handleOpen();
    }

    return (
        <Box mb={2}>
            <Collapse in={!collapse.open} timeout={0} unmountOnExit>
                <Grid container spacing={1} wrap="nowrap">

                    <Grid item>
                        <Avatar　alt={comment.user.name}　src={comment.user.iconUrl} />
                    </Grid>

                    <Grid item xs zeroMinWidth>
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
                            </Grid>
                        </Box>
                    </Grid>

                    <Grid item>
                        {auth.user.id === comment.user.id ? (
                            <SimpleMenu icon={<MoreVert />} menuItems={menuItems} />
                        ) : (
                            <Box ml={6}/>
                        )}

                        <DeleteDialog 
                            open={dialog.open}
                            itemName="コメント"
                            onClose={dialog.handleClose}
                            onDelete={handleCommentDelete}
                        />
                    </Grid>

                </Grid>

                <Snackbar
                    anchorOrigin={{ vertical: "bottom", horizontal: "left"}}
                    open={snackbar.open}
                    message={message}
                    autoHideDuration={3000}
                    onClose={snackbar.handleClose}
                />
            </Collapse>

            <Collapse in={collapse.open} timeout={0} unmountOnExit>
                <CommentPoser
                    onCommentSubmit={handleCommentSubmit}
                    defaultInput={comment.content}
                    onCancel={collapse.handleClose}
                    buttonLabel="更新"
                />
            </Collapse>
        </Box>
    );
}

/**
 * 表示・非表示を切り替えるコンポーネント用のフック
 */
function useOpenState() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return { open, handleOpen, handleClose };
}

/**
 * 削除の確認をするダイアログ
 */
function DeleteDialog(props) {
    const { open, itemName, onClose, onDelete } = props;

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>削除の確認</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {`${itemName}を削除しますか？`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={onClose}>キャンセル</Button>
                <Button variant="contained" color="primary" onClick={onDelete}>削除</Button>
            </DialogActions>
        </Dialog>
    )
}


