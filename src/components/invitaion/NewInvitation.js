import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useAuth } from "../auth/use-auth";
import useInvitationAPI from "../http/invitationAPI";
import useErrors from "../utils/use-erros";
import { DateTimePicker, formatTime, CapacitySelecter } from "./InputField";
import { useForm } from "react-hook-form";
import MainContainer from "../utils/MainContainer";
import {
    Typography,
    TextField,
    Card,
    CardHeader,
    CardContent,
    Button,
    Grid
} from "@material-ui/core";

const defaultValues = {
    title: "",
    description: "",
    startTime: null,
    endTime: null,
    capacity: null
}

/**
 * 募集投稿ページ
 */
export default function NewInvitation() {
    const auth = useAuth();
    const invitationAPI = useInvitationAPI();
    const pageError = useErrors(invitationAPI.error, auth.error);

    const { register, handleSubmit, watch, control, errors } = useForm({ defaultValues });

    const [sumbitSuccess, setSubmitSuccess] = useState(false);

    // 募集を投稿する
    const onSubmit = async (input) => {
        const { startTime, endTime, ...rest } = input;
        input.startTime = formatTime(startTime);
        input.endTime = formatTime(endTime);

        const success = await invitationAPI.post(input);
        setSubmitSuccess(success);
    };

    // 描画処理
    if (sumbitSuccess) {
        return <Redirect to={invitationAPI.data.redirectTo} />
    } else {
        return (
            <MainContainer error={pageError} maxWidth="sm">
                <Card>
                    <CardHeader 
                        title={<Typography variant="h6" component='h1'>募集の新規作成</Typography>}
                    />
                    <CardContent>
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
                                        before=""
                                        after="endTime"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <DateTimePicker 
                                        name="endTime"
                                        label="終了時刻"
                                        control={control}
                                        watch={watch}
                                        errors={errors}
                                        before="startTime"
                                        after=""
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <CapacitySelecter
                                        name="capacity"
                                        label="定員"
                                        watch={watch}
                                        control={control}
                                        errors={errors}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="contained" color="primary" type="submit">投稿する</Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </MainContainer>
        );
    }
}