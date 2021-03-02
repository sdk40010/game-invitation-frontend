import { useState, useEffect, useContext, createContext } from "react";

import { useAuth } from "../auth/useAuth";
import useOpenState from "../utils/useOpenState";
import useLoading from "../utils/useLoading";

import { useForm, useWatch } from "react-hook-form";

import EventEmitter from 'events';

import SimpleMenu from "../utils/SimpleMenu";
import DeleteDialog from "../utils/DeleteDialog";

import { makeStyles } from "@material-ui/core/styles";
import { fade } from '@material-ui/core/styles/colorManipulator';
import {
    Typography,
    Button,
    Avatar,
    Grid,
    Box,
    TextField,
    Snackbar,
    Collapse,
    CircularProgress
} from "@material-ui/core";
import { MoreVert } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    commentContent: {
        overflowWrap: "break-word"
    },
    commentPosterButtonWrapper: {
        "& > *:not(:last-child)": {
            marginRight: theme.spacing(1)
        }
    },
    actionText: {
        cursor: "pointer",
        "&:hover": {
            color: fade(theme.palette.common.black, .72)
        }
    },
    // アイコン用
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    }
}));

/**
 * コメント投稿フォーム
 */
export function CommentPoster(props) {
    const {
        onCommentSubmit,
        inputProps,
        onCancel = () => {},
        buttonLabel = "投稿",
        snackbarMessage,
        iconSize
    } = props;

    const auth = useAuth();

    const classes = useStyles();

    const defaultValues = { [inputProps.name]: inputProps.defaultValue };
    const { register, control, handleSubmit, setValue } = useForm({defaultValues});
    const comment = useWatch({ name: inputProps.name, control });

    // 投稿・キャンセルボタン用
    const collapse = useOpenState();
    const handleCancelClick = () => {
        onCancel();
        collapse.handleClose();
    }

    // 投稿の完了を通知するためのスナックバー用
    const snackbar = useOpenState();

    // コメントの投稿
    const onSubmit = async (input) => {
        await onCommentSubmit(input);
        setValue(inputProps.name, "");
        collapse.handleClose();
        snackbar.handleOpen();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1}>

                <Grid container item alignItems="center">

                    <Grid item>
                        <Avatar alt={auth.user.name} src={auth.user.iconUrl} className={classes[iconSize] ?? "" } />
                    </Grid>

                    <Grid item xs>
                        <Box pl={1}>
                            <TextField
                                name={inputProps.name}
                                placeholder={`${inputProps.label}を入力`}
                                variant="outlined"
                                inputRef={register({
                                    minLength: { value: 1, message: `${inputProps.label}には1文字以上の文字列を指定してください。`}
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

                            <Button variant="contained" color="primary" type="submit" disabled={! Boolean(comment)}>
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

// コメント一覧用のコンテキスト
const commentListContext = createContext();

// コメント一覧コンテキストを利用するためのフック
const useCommentContext = () => {
    return useContext(commentListContext);
}

/**
 * コメント一覧
 */
export function CommentList({commentAPI, replyAPI}) {
    const value = { commentAPI, replyAPI };

    return (
        <commentListContext.Provider value={value}>
            {commentAPI.data.map((comment, i) => (
                <CommentListItem
                    comment={comment}
                    key={i}
                />
            ))}
        </commentListContext.Provider>
    );
}

/**
 * コメント一覧アイテム
 */
function CommentListItem({comment}) {
    const { commentAPI, replyAPI } = useCommentContext();

    // コメントの更新
    const handleCommentUpdate = async (input) => {
        return await commentAPI.update(input, comment.invitationId, comment.id);
    }

    // コメントの削除
    const handleCommentDelete = async () => {
        return await commentAPI.remove(comment.invitationId, comment.id);
    }

    // 返信の投稿
    const handleReplySubmit = async (input) => {
        const success1 = await replyAPI.post(input, comment.id);
        // コメントの返信件数を更新するために、返信先のコメントを再取得する
        const success2 = await commentAPI.get(comment.invitationId, comment.id);
        return success1 && success2;
    }

    const eventEmitter = new EventEmitter();

    return (
        <Box mb={2}>
            <Comment
                comment={comment}
                inputProps={{ name: "comment", label:"コメント", defaultValue: comment.content }}
                onCommentUpdate={handleCommentUpdate}
                onCommentDelete={handleCommentDelete}
                onReplySubmit={handleReplySubmit}
                eventEmitter={eventEmitter}
            />

            <ReplyList
                comment={comment}
                eventEmitter={eventEmitter}
            />
        </Box>
    );
}

/**
 * コメント
 */
function Comment(props) {
    const {
        comment,
        inputProps,
        onCommentUpdate,
        onCommentDelete,
        onReplySubmit,
        iconSize,
        eventEmitter
    } = props;

    const auth = useAuth();

    const classes = useStyles();

    // コメント更新フォーム用
    const commentCollapse = useOpenState();

    // 更新・削除の完了を通知するためのスナックバー用
    const snackbar = useOpenState();
    const [message, setMessage] = useState("");

    // 削除の確認をするダイアログ用
    const dialog = useOpenState();

    // コメントの操作メニュー用
    const menuItems = [
        {
            label: "編集",
            onClick: commentCollapse.handleOpen
        },
        {
            label: "削除",
            onClick: dialog.handleOpen
        }
    ];

    // コメントの更新
    const handleCommentUpdate = async (input) => {
        const success = await onCommentUpdate(input);
        commentCollapse.handleClose();

        if (success) {
            setMessage(`${inputProps.label}を更新しました。`);
            snackbar.handleOpen();
        }
    }

    // コメントの削除
    const handleCommentDelete = async () => {
        const success = await onCommentDelete();
        dialog.handleClose();

        if (success) {
            setMessage(`${inputProps.label}を削除しました。`);
            snackbar.handleOpen();
        }
    }

    // 返信投稿フォーム用
    const replyCollapse = useOpenState();

    // 返信の投稿
    const handleReplySubmit = async (input) => {
        const success = await onReplySubmit(input);

        if (eventEmitter) {
            // ReplyListの返信一覧を開く処理を呼び出す
            eventEmitter.emit("replySubmit");
        }

        replyCollapse.handleClose();
        if (success) {
            setMessage("返信を投稿しました。");
            snackbar.handleOpen();
        }
    }

    return (
        <Box mb={1}>

            {/* 通常時*/}
            <Collapse in={!commentCollapse.open} timeout={0} unmountOnExit>
                <Grid container spacing={1} wrap="nowrap">

                    <Grid item>
                        <Avatar　alt={comment.user.name}　src={comment.user.iconUrl} className={classes[iconSize] ?? ""} />
                    </Grid>

                    <Grid item xs zeroMinWidth>
                        <Box pl={1} mt={-1}> {/** mt=-1はアイコンと高さを揃えるため */}

                            <Box mb={.25}>
                                <Grid container spacing={1}>
                                    <Grid item>
                                        <Typography variant="body2">{comment.user.name}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body2" color="textSecondary">{comment.createdAt}</Typography>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box mb={1} className={classes.commentContent}>
                                <Typography>{comment.content}</Typography>
                            </Box>

                            <Box>
                                <ActionText onClick={replyCollapse.handleOpen}>返信</ActionText>
                            </Box>

                            <Box>
                                <Collapse in={replyCollapse.open} timeout={0} unmountOnExit>
                                    <Box mt={2}>
                                        <CommentPoster
                                            onCommentSubmit={handleReplySubmit}
                                            inputProps={{ name: "reply", label:"返信", defaultValue: "" }}
                                            onCancel={replyCollapse.handleClose}
                                            buttonLabel="返信"
                                            iconSize={iconSize}
                                        />
                                    </Box>
                                </Collapse>
                            </Box>

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

            {/* 編集時 */}
            <Collapse in={commentCollapse.open} timeout={0} unmountOnExit>
                <CommentPoster
                    onCommentSubmit={handleCommentUpdate}
                    inputProps={inputProps}
                    onCancel={commentCollapse.handleClose}
                    buttonLabel="更新"
                    iconSize={iconSize}
                />
            </Collapse>
        </Box>
    );
}

/**
 * 返信一覧
 */
function ReplyList({comment, eventEmitter}) {
    const { replyAPI } = useCommentContext();

    const loading = useLoading(replyAPI.data?.get(comment.id));

    // 返信一覧用
    const collapse = useOpenState();

    const repliesLoaded = Boolean(replyAPI.data?.get(comment.id));
    const hasReplies = Boolean(comment.repliesCount);
    const replies = replyAPI.data?.get(comment.id) ?? [];

    // 返信一覧の表示・非表示
    const handleClick = async () => {
        if (collapse.open) {
            collapse.handleClose();
        } else {
            collapse.handleOpen();
        }

        if (hasReplies && !repliesLoaded) { // 返信一覧を取得済みでないとき
            await replyAPI.getAll(comment.id);
        }
    }

    useEffect(() => {
        // Commentコンポーネントで返信が投稿されたときの処理を登録
        const handleReplySubmit = () => collapse.handleOpen();
        eventEmitter.on("replySubmit", handleReplySubmit);

        // イベントリスナーの解除
        return () => eventEmitter.off("replySubmit", handleReplySubmit);
    }, [])

    return (
        hasReplies ? (
            <Box ml={7}>
                <Box>
                    <ActionText onClick={handleClick}>
                        {collapse.open ? "返信を非表示" : "返信を表示"}
                    </ActionText>
                </Box>
            

                <Collapse in={collapse.open} timeout={0} unmountOnExit>
                    {loading ? (
                        <Box mt={2} mb={1}>
                            <CircularProgress color="secondary" size={30} />
                        </Box>
                    ) : (
                        <Box mt={2}>
                            {replies.map((reply, i) => (
                                <ReplyListItem reply={reply} key={i} />
                            ))}
                        </Box>
                    )}
                    
                </Collapse>
                
            </Box>
        ) : (
            <></>
        )
    );
}

/**
 * 返信一覧アイテム
 */
function ReplyListItem({reply}) {
    const { commentAPI, replyAPI } = useCommentContext();

    // 返信の更新
    const handleReplyUpdate = async (input) => {
        // return replyAPI.update(input, reply.commentId, reply.id);
    }

    // 返信の削除
    const handleReplyDelete = async () => {
        // return replyAPI.remove(reply.commentId, reply.id);
    }

    // 返信の投稿
    const handleReplySubmit = async (input) => {
        const success1 = replyAPI.post(input, reply.commentId);
        const success2 = commentAPI.get(reply.comment.invitationId, reply.commentId);
        return success1 && success2;
    }

    return (
        <Box mb={2}>
            <Comment 
                comment={reply}
                inputProps={{ name: "reply", label:"返信", defaultValue: reply.content }}
                onCommentUpdate={handleReplyUpdate}
                onCommentDelete={handleReplyDelete}
                onReplySubmit={handleReplySubmit}
                iconSize="small"
            />
        </Box>
    );
}

/**
 * クリックアクションがあるテキスト
 */
function ActionText({children, onClick}) {
    const classes = useStyles();

    return (
        <Typography
            variant="body2"
            color="textSecondary"
            component="span"
            onClick={onClick}
            className={classes.actionText}
        >
            {children}
        </Typography>
    );
}