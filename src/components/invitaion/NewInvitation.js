import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useAuth } from "../auth/use-auth";
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

export default function NewInvitation() {
    const auth = useAuth();
    const { register, handleSubmit, watch, control, errors } = useForm();
    const [isSubmitted, setIsSubmitted] = useState(null);
    let redirectTo = "";

    const onSubmit = async (data) => {
        const { startTime, endTime, ...rest } = data;
        data.startTime = formatTime(startTime);
        data.endTime = formatTime(endTime);
        console.log(data);
        const res = await auth.apiCall("/api/v1/invitations", "POST", data);
        if (res.ok) {
            setIsSubmitted(true);
            redirectTo = res.json().redirectTo;
        } else {
            setIsSubmitted(true);
        }
    };

    if (isSubmitted) {
        // return <Redirect to={redirectTo}/>;
        return <Redirect to="/"/>;
    } else {
        return (
            <MainContainer maxWidth="sm">
                <Card>
                    <CardHeader 
                        title={<Typography variant="h5" component='h1'>募集の新規作成</Typography>}
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