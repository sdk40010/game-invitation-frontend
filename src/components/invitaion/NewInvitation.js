import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

import { useAuth } from "../auth/useAuth";
import useInvitationAPI from "../http/invitationAPI";
import useTagAPI from "../http/tagAPI";
import useErrors from "../utils/useErros";

import { useForm } from "react-hook-form";

import MainContainer from "../utils/MainContainer";
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
    Grid
} from "@material-ui/core";

const defaultValues = {
    title: "",
    description: "",
    startTime: null,
    endTime: null,
    capacity: "",
    tags: []
}

/**
 * 募集投稿ページ
 */
export default function NewInvitation() {
    const auth = useAuth();
    const invitationAPI = useInvitationAPI();
    const tagAPI = useTagAPI();
    const pageError = useErrors(auth.error, invitationAPI.error, tagAPI.error);

    const { register, handleSubmit, watch, control, errors } = useForm({ defaultValues });

    const [sumbitSuccess, setSubmitSuccess] = useState(false);

    // タグ一覧の取得
    useEffect(() => {
        (async () => {
            await tagAPI.getAll();
        })();
    }, []);

    // 募集を投稿する
    const onSubmit = async (input) => {
        // 時刻の表示形式を整える
        const { startTime, endTime } = input;
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
                                        error={errors.title && true}
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
                                        watch={watch}
                                        control={control}
                                        errors={errors}
                                        before={null}
                                        after={{ name: "endTime", label: "終了時刻"}}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <DateTimePicker 
                                        name="endTime"
                                        label="終了時刻"
                                        watch={watch}
                                        control={control}
                                        errors={errors}
                                        before={{ name: "startTime", label: "開始時刻"}}
                                        after={null}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <CapacitySelector
                                        name="capacity"
                                        label="定員"
                                        watch={watch}
                                        control={control}
                                        errors={errors}
                                        data={tagAPI.data}
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
                                    <Button variant="contained" color="primary" type="submit">投稿</Button>
                                </Grid>

                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </MainContainer>
        );
    }
}