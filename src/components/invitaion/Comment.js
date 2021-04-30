import { useEffect, useContext, createContext, useMemo } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../auth/useAuth";
import { useOpenState, useSnackbar } from "../utils/useOpenState";
import useLoading from "../utils/useLoading";

import { useForm, useWatch } from "react-hook-form";

import EventEmitter from 'events';

import SimpleMenu from "../utils/SimpleMenu";
import SimpleLink from "../utils/SimpleLink";
import DeleteDialog from "../utils/DeleteDialog";

import { makeStyles } from "@material-ui/core/styles";
import {
    Typography,
    Button,
    Avatar,
    Grid,
    Box,
    TextField,
    Snackbar,
    Collapse,
    CircularProgress,
    Chip,
} from "@material-ui/core";
import { MoreVert } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    commentContent: {
        overflowWrap: "break-word"
    },
    commentPosterButtonsWrapper: {
        "& > *:not(:last-child)": {
            marginRight: theme.spacing(1)
        }
    },
    replyToLink: {
        color: theme.palette.link.main,
    },
    actionText: {
        cursor: "pointer",
        "&:hover": {
            color: theme.palette.text.primary
        }
    },
    // アイコン用
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    }
}));

// コメント一覧用のコンテキスト
const commentListContext = createContext();

// コメント一覧コンテキストを利用するためのフック
const useCommentListContext = () => {
    return useContext(commentListContext);
}

/**
 * コメント一覧
 */
export function CommentList({commentAPI, replyAPI}) {
    const snackbar = useSnackbar();

    const value = { commentAPI, replyAPI, snackbar };

    const { id } = useParams(); // 募集ID

    // コメントの投稿
    const handleCommentSubmit = async (input) => {
        const success = await commentAPI.post(input, id);
        if (success) {
            snackbar.handleOpen("コメントを投稿しました");
        }
    }

    return (
        <commentListContext.Provider value={value}>
            <Box mb={4}>
                <CommentPoster
                    onCommentSubmit={handleCommentSubmit}
                    inputProps={{ name: "comment", label:"コメント", defaultValue: "" }}
                />
            </Box>

            {commentAPI.data.map(comment => (
                <CommentListItem comment={comment} key={comment.id} />
            ))}

            <Snackbar 
                anchorOrigin={{ vertical: "bottom", horizontal: "left"}}
                open={snackbar.open}
                message={snackbar.message}
                autoHideDuration={3000}
                onClose={snackbar.handleClose}
            />
        </commentListContext.Provider>
    );
}

/**
 * コメント投稿フォーム
 */
function CommentPoster(props) {
    const {
        onCommentSubmit,
        inputProps,
        onCancel = () => {},
        buttonLabel = "投稿",
        iconSize
    } = props;

    const auth = useAuth();

    const classes = useStyles();

    const defaultValues = inputProps.replyTo
        ? { [inputProps.name]: inputProps.defaultValue, replyTo: inputProps.replyTo.id } // 返信一覧内で返信する場合
        : { [inputProps.name]: inputProps.defaultValue };

    const { register, control, handleSubmit, setValue } = useForm({defaultValues});
    const comment = useWatch({ name: inputProps.name, control });

    // 投稿・キャンセルボタン用
    const collapse = useOpenState();
    const handleCancelClick = () => {
        onCancel();
        collapse.handleClose();
    }

    // コメントの投稿
    const onSubmit = async (input) => {
        await onCommentSubmit(input);
        setValue(inputProps.name, "");
        collapse.handleClose();
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
                            {inputProps.replyTo && (
                                <Box mb={1}><Chip label={`@${inputProps.replyTo.name}`} size="small" /></Box>
                            )}

                            <TextField
                                name={inputProps.name}
                                placeholder={inputProps.replyTo
                                    ? `${inputProps.replyTo.name}への${inputProps.label}を入力`
                                    : `${inputProps.label}を入力`
                                }
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
                        {inputProps.replyTo && <input name="replyTo" ref={register} hidden />}
                    </Grid>

                </Grid>

                <Grid container item spacing={2} justify="flex-end">

                    <Grid item>
                        <Collapse
                            in={collapse.open}
                            timeout={0}
                            unmountOnExit
                            classes={{ wrapperInner: classes.commentPosterButtonsWrapper }}
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
        </form>
    );
}

/**
 * コメント一覧アイテム
 */
function CommentListItem({comment}) {
    const { commentAPI, replyAPI } = useCommentListContext();

    // コメントの更新
    const handleCommentUpdate = async (input) => {
        return await commentAPI.update(input, comment.invitationId, comment.id);
    }

    // コメントの削除
    const handleCommentDelete = async () => {
        const success = await commentAPI.remove(comment.invitationId, comment.id);
        return success;
    }

    // 返信の投稿
    const handleReplySubmit = async (input) => {
        const success1 = await replyAPI.post(input, comment.id);
        const success2 = await replyAPI.getAll(comment.id);
        // コメントの返信件数を更新するために、返信先のコメントを再取得する
        const success3 = await commentAPI.get(comment.invitationId, comment.id);
        return Boolean(success1 && success2 && success3);
    }

    // CommentとReplyListで共有するイベントエミッター
    const eventEmitter = useMemo(() => new EventEmitter(), []);

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
        eventEmitter,
        replyTo,
    } = props;

    const auth = useAuth();

    const classes = useStyles();

    // コメント更新フォーム用
    const commentCollapse = useOpenState();

    // 操作の完了を通知するためのスナックバー用
    const { snackbar } = useCommentListContext();

    // 削除の確認をするダイアログ用
    const dialog = useOpenState();

    // コメントの操作メニュー用
    const menuItems = [
        {
            content: "編集",
            onClick: commentCollapse.handleOpen
        },
        {
            content: "削除",
            onClick: dialog.handleOpen
        }
    ];

    // コメントの更新
    const handleCommentUpdate = async (input) => {
        const success = await onCommentUpdate(input);
        commentCollapse.handleClose();

        if (success) {
            snackbar.handleOpen(`${inputProps.label}を更新しました`);
        }
    }

    // コメントの削除
    const handleCommentDelete = async () => {
        const success = await onCommentDelete();
        dialog.handleClose();

        if (success) {
            snackbar.handleOpen(`${inputProps.label}を削除しました`);
        }
    }

    // 返信投稿フォーム用
    const replyCollapse = useOpenState();

    // 返信の投稿
    const handleReplySubmit = async (input) => {
        replyCollapse.handleClose();
        if (eventEmitter) {
            // ReplyListの返信一覧を開く処理を呼び出す
            eventEmitter.emit("replySubmit");
        }

        const success = await onReplySubmit(input);
        if (success) {
            snackbar.handleOpen("返信を投稿しました");
        }
    }

    return (
        <Box mb={1}>

            {/* 通常時*/}
            <Collapse in={!commentCollapse.open} timeout={0} unmountOnExit>
                <Grid container spacing={1} wrap="nowrap">

                    <Grid item>
                        <SimpleLink to={`/users/${comment.user.id}`} display="inline-block">
                            <Avatar
                                alt={comment.user.name}
                                src={comment.user.iconUrl}
                                className={classes[iconSize] ?? ""}
                            />
                        </SimpleLink>
                    </Grid>

                    <Grid item xs zeroMinWidth>
                        <Box pl={1} mt={-1}> {/** mt=-1はアイコンと高さを揃えるため */}

                            <Box mb={.25}>
                                <Grid container spacing={1}>
                                    <Grid item>
                                        <SimpleLink to={`/users/${comment.user.id}`} display="inline-block">
                                            <Typography variant="body2">{comment.user.name}</Typography>
                                        </SimpleLink>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body2" color="textSecondary">{comment.createdAt}</Typography>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box mb={1} className={classes.commentContent}>
                                {comment.to && (
                                    <Typography component="span" className={classes.replyToLink}>
                                        {`@${comment.to.name}`}&nbsp;
                                    </Typography>
                                )}
                                <Typography　component="span">{comment.content}</Typography>
                            </Box>

                            <Box>
                                <ActionText onClick={replyCollapse.handleOpen}>返信</ActionText>
                            </Box>

                            <Box>
                                <Collapse in={replyCollapse.open} timeout={0} unmountOnExit>
                                    <Box mt={2}>
                                        <CommentPoster
                                            onCommentSubmit={handleReplySubmit}
                                            inputProps={{ name: "reply", label:"返信", defaultValue: "", replyTo }}
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
                            itemName={inputProps.label}
                            onClose={dialog.handleClose}
                            onDelete={handleCommentDelete}
                        />
                    </Grid>

                </Grid>
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
    const { replyAPI } = useCommentListContext();

    const loading = useLoading([replyAPI.data?.get(comment.id)]);

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

        return () => eventEmitter.off("replySubmit", handleReplySubmit);
    }, []);

    return (
        hasReplies && (
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
                            {replies.map(reply => (
                                <ReplyListItem reply={reply} key={reply.id} />
                            ))}
                        </Box>
                    )}
                </Collapse>
            </Box>
        ) 
    );
}

/**
 * 返信一覧アイテム
 */
function ReplyListItem({reply}) {
    const { commentAPI, replyAPI } = useCommentListContext();

    // 返信の更新
    const handleReplyUpdate = async (input) => {
        return await replyAPI.update(input, reply.commentId, reply.id);
    }

    // 返信の削除
    const handleReplyDelete = async () => {
        const success1 = await replyAPI.remove(reply.commentId, reply.id);
        const success2 = await commentAPI.get(reply.comment.invitationId, reply.commentId);
        return Boolean(success1 && success2);
    }

    // 返信の投稿
    const handleReplySubmit = async (input) => {
        const success1 = await replyAPI.post(input, reply.commentId);
        const success2 = await commentAPI.get(reply.comment.invitationId, reply.commentId);
        return Boolean(success1 && success2);
    }

    return (
        <Box mb={2}>
            <Comment 
                comment={reply}
                inputProps={{ name: "reply", label:"返信", defaultValue: reply.content, replyTo: reply.to }}
                onCommentUpdate={handleReplyUpdate}
                onCommentDelete={handleReplyDelete}
                onReplySubmit={handleReplySubmit}
                iconSize="small"
                replyTo={reply.user}
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