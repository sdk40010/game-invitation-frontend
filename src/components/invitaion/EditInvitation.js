import React, { useState, useEffect } from "react";
import { Redirect, useParams } from "react-router-dom";

import { useAuth } from "../auth/useAuth";
import usePermission from "../utils/usePermission";
import useInvitationAPI from "../http/invitationAPI";
import useTagAPI from "../http/tagAPI";
import useErrors from "../utils/useErros";

import { useForm } from "react-hook-form";

import MainContainer from "../utils/MainContainer";
import CenteredCircularProgress from "../utils/CenteredCircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import { fade } from '@material-ui/core/styles/colorManipulator';
import {
    DateTimePicker,
    formatTime,
    CapacitySelector,
    TagSelector
} from "./InputField";
import {
    Typography,
    TextField,
    Card,
    CardHeader,
    CardContent,
    Button,
    Grid,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    DialogContentText
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    deleteButtonContainer: {
        marginTop: theme.spacing(4)
    },
    deleteButton: {
        color: theme.palette.error.main,
        borderColor: fade(theme.palette.error.main, .5),
        "&:hover": {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.common.white
        }
    }
}));

const defaultValues = {
    title: "",
    description: "",
    startTime: null,
    endTime: null,
    capacity: "",
    tags: []
}

/**
 * 募集編集ページ
 */
export default function EditInvitation() {
    const auth = useAuth();
    const invitationAPI = useInvitationAPI();
    const tagAPI = useTagAPI();
    const permission = usePermission(
        () => {
            if (auth.user && invitationAPI.data) {
                return auth.user.id === invitationAPI.data.user.id;
            }
        },
        "編集権限がありません。",
        auth.user,
        invitationAPI.data
    );

    const pageError = useErrors(
        auth.error,
        invitationAPI.error,
        tagAPI.error,
        permission.error,
    );

    const { id } = useParams();

    const { register, handleSubmit, watch, control, errors, reset } = useForm({ defaultValues });

    const [isLoading, setIsLoading] = useState(true);
    const [sumbitSuccess, setSubmitSuccess] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const classes = useStyles();

    // 募集の取得
    useEffect(() => {
        (async () => {
            const invitation = await invitationAPI.get(id);
            // defaultValuesを更新する
            reset({
                title: invitation.title,
                description: invitation.description,
                startTime: new Date(invitation.startTime),
                endTime: new Date(invitation.endTime),
                capacity: invitation.capacity,
                tags: invitation.tags
            });
            setIsLoading(false);
        })();
    }, []);

    // タグ一覧の取得
    useEffect(() => {
        (async () => {
            await tagAPI.getAll();
        })();
    }, []);


    // 募集の更新
    const onSubmit = async (input) => {
        // 時刻の表示形式を整える
        const { startTime, endTime } = input;
        input.startTime = formatTime(startTime);
        input.endTime = formatTime(endTime);

        // 編集前のタグ一覧を送信情報に追加する
        input.tagsBeforeEdit = invitationAPI.data.tags;

        const success = await invitationAPI.update(id, input);
        setSubmitSuccess(success);
    };

    // 編集用フォーム
    const form = (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>

                <Grid item xs={12}>
                    <TextField
                        name="title"
                        variant="outlined"
                        fullWidth
                        label="タイトル"
                        inputRef={register({
                            required: { value: true, message: "タイトルは必須です。"　},
                            maxLength:{ value: 255, message: "タイトルには255文字までの文字列を指定してください。"　}
                        })}
                        error={errors.title}
                        helperText={errors.title && errors.title.message}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        name="description"
                        variant="outlined"
                        fullWidth
                        label="説明"
                        inputRef={register}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <DateTimePicker 
                        name="startTime"
                        label="開始時刻"
                        control={control}
                        watch={watch}
                        errors={errors}
                        before={null}
                        after={{ name: "endTime", label: "終了時刻"}}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <DateTimePicker 
                        name="endTime"
                        label="終了時刻"
                        control={control}
                        watch={watch}
                        errors={errors}
                        before={{ name: "startTime", label: "開始時刻"}}
                        after={null}
                    />
                </Grid>

                <Grid item xs={6}>
                    <CapacitySelector
                        name="capacity"
                        label="定員"
                        watch={watch}
                        control={control}
                        errors={errors}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TagSelector 
                        name="tags"
                        label="タグ"
                        watch={watch}
                        control={control}
                        errors={errors}
                        data={tagAPI.data}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button variant="contained" color="primary" type="submit">更新</Button>
                </Grid>

            </Grid>
        </form>
    );

    // 削除用ダイアログ
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleDelete = async () => {
        setOpen(false);
        const success = await invitationAPI.remove(id);
        setDeleteSuccess(success);
    }

    const deleteDialog = (
        <Grid container justify="center" className={classes.deleteButtonContainer}>
            <Grid item>
                <Button
                    variant="outlined"
                    className={classes.deleteButton}
                    onClick={handleClickOpen}
                >
                    削除
                </Button>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    fullWidth
                >
                    <DialogTitle>削除の確認</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            募集を削除しますか？
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={handleClose}>キャンセル</Button>
                        <Button variant="outlined" color="primary" onClick={handleDelete}>削除</Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </Grid>
    )

    // 描画処理
    if (sumbitSuccess) {
        return <Redirect to={`/invitations/${id}`}/>;
    } else if (deleteSuccess) {
        return <Redirect to="/"/>
    } else {
        return (
            <MainContainer error={pageError} maxWidth="sm">
                <Card>
                    <CardHeader 
                        title={<Typography variant="h6" component='h1'>募集の編集</Typography>}
                    />
                    <CardContent>
                        {/* invitationAPi.dataで描画内容の出し分けをすると、defaultValuesを更新する前にformが描画がされてしまい、
                            テキストフィールドの表示がおかしくなるので、isLoadingで描画内容を出し分ける
                         */}
                        {isLoading ? (
                            <CenteredCircularProgress />
                        ) : (
                            form
                        )
                        }
                    </CardContent>
                </Card>
                {deleteDialog}
            </MainContainer>
        );
    }
}