import { useState, useEffect } from "react";
import { Redirect, useParams } from "react-router-dom";

import { useAuth } from "../auth/useAuth";
import usePermission from "../utils/usePermission";
import useInvitationAPI from "../http/invitationAPI";
import useTagAPI from "../http/tagAPI";
import { useOpenState } from "../utils/useOpenState";

import MainContainer from "../utils/MainContainer";
import InvitationForm from "./InvitationForm";
import DeleteDialog from "../utils/DeleteDialog";
import { formatTime } from "./InputField";

import { makeStyles } from "@material-ui/core/styles";
import { fade } from '@material-ui/core/styles/colorManipulator';
import {
    Typography,
    Card,
    CardHeader,
    CardContent,
    Button,
    Grid,
    Box,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    deleteButton: {
        color: theme.palette.error.main,
        borderColor: fade(theme.palette.error.main, .5),
        "&:hover": {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.common.white
        }
    }
}));

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

    // 編集フォームの初期値
    const [defaultValues, setDefaultValues] = useState(null);

    const errors = [invitationAPI.error, tagAPI.error, permission.error];
    const resources = [invitationAPI.data, tagAPI.data, defaultValues];

    const { id } = useParams(); // 募集ID

    const [sumbitSuccess, setSubmitSuccess] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const classes = useStyles();

    // 募集の取得
    useEffect(() => {
        (async () => {
            const invitation = await invitationAPI.get(id);
            setDefaultValues({
                title: invitation.title,
                description: invitation.description,
                startTime: new Date(invitation.startTime),
                endTime: new Date(invitation.endTime),
                capacity: invitation.capacity,
                tags: invitation.tags
            });
        })();
    }, []);

    // タグ一覧の取得
    useEffect(() => {
        (async () => {
            await tagAPI.getAll();
        })();
    }, []);

    // 募集の更新
    const handleSubmit = async (input) => {
        // 時刻の表示形式を整える
        const { startTime, endTime } = input;
        input.startTime = formatTime(startTime);
        input.endTime = formatTime(endTime);

        // 編集前のタグ一覧を送信情報に追加する
        input.tagsBeforeUpdate = invitationAPI.data.tags;

        const success = await invitationAPI.update(id, input);
        setSubmitSuccess(success);
    };

    // 削除の確認をするダイアログ用
    const dialog = useOpenState();

    // 募集の削除
    const handleDelete = async () => {
        dialog.handleClose();
        const success = await invitationAPI.remove(id);
        setDeleteSuccess(success);
    }

    if (sumbitSuccess) {
        return <Redirect to={`/invitations/${id}`}/>;
    } else if (deleteSuccess) {
        return <Redirect to="/"/>
    }

    return (
        <MainContainer errors={errors} resources={resources} maxWidth="sm">
            <>
                <Card>
                    <CardHeader 
                        title={<Typography variant="h6" component='h1'>募集の編集</Typography>}
                    />
                    <CardContent>
                        <InvitationForm 
                            onSubmit={handleSubmit}
                            defaultValues={defaultValues}
                            tagOptions={tagAPI.data}
                            buttonLabel="更新"
                        />
                    </CardContent>
                </Card>

            <Box mt={4}>
                <Grid container justify="center">
                    <Grid item>
                            <Button variant="outlined"
                                className={classes.deleteButton}
                                onClick={dialog.handleOpen}
                            >
                                削除
                            </Button>

                            <DeleteDialog 
                                open={dialog.open}
                                itemName="募集"
                                onClose={dialog.handleClose}
                                onDelete={handleDelete}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </>
        </MainContainer>
    );
    
}