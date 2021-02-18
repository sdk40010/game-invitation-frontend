import React, { useState, useEffect } from "react";
import { Redirect, useParams } from "react-router-dom";
import { useAuth } from "../auth/use-auth";
import useErrors from "../utils/use-erros";
import useInvitationAPI from "../http/invitationAPI";
import { useForm } from "react-hook-form";
import { DateTimePicker, formatTime, CapacitySelecter } from "./InputField";
import MainContainer from "../utils/MainContainer";
import CenteredCircularProgress from "../utils/CenteredCircularProgress";
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
 * 募集編集ページ
 */
export default function EditInvitation() {
    const auth = useAuth();
    const invitationAPI = useInvitationAPI();
    const pageError = useErrors(invitationAPI.error, auth.error);

    const { userId, invitationId } = useParams();

    const { register, handleSubmit, watch, control, errors, reset } = useForm({defaultValues});

    const [isLoading, setIsLoading] = useState(true);
    const [sumbitSuccess, setSubmitSuccess] = useState(false);

    // 募集の取得
    useEffect(() => {
        const getInvitation = async () => {
            const json = await invitationAPI.get(invitationId);
            // defaultValuesを更新する
            reset({
                title: json.title,
                description: json.description,
                startTime: new Date(json.startTime),
                endTime: new Date(json.endTime),
                capacity: json.capacity
            });
            setIsLoading(false);
        }
        getInvitation();
    }, []);

    // 募集の更新
    const onSubmit = async (input) => {
        const { startTime, endTime, ...rest } = input;
        input.startTime = formatTime(startTime);
        input.endTime = formatTime(endTime);
        console.log(input);

        const success = await invitationAPI.update(userId, invitationId, input);
        setSubmitSuccess(success);
    };

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
                    <Button variant="contained" color="primary" type="submit">更新する</Button>
                </Grid>
            </Grid>
        </form>
    );

    // 描画処理
    if (sumbitSuccess) {
        return <Redirect to={`/invitations/${invitationId}`}/>;
    } else {
        return (
            <MainContainer error={pageError} maxWidth="sm">
                <Card>
                    <CardHeader 
                        title={<Typography variant="h6" component='h1'>募集の編集</Typography>}
                    />
                    <CardContent>
                        {isLoading ? (
                            <CenteredCircularProgress />
                        ) : (
                            form
                        )
                        }
                    </CardContent>
                </Card>
            </MainContainer>
        );
    }
}