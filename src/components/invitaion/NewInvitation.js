import React from "react";
import { useAuth } from "../auth/use-auth";
import { Typography, TextField, MenuItem } from "@material-ui/core";
import { DateTimePicker, formatTime, CapacitySelecter } from "./InputField";
import { useForm } from "react-hook-form";

export default function NewInvitation() {
    const auth = useAuth();
    const { register, handleSubmit, watch, control, errors } = useForm();

    const onSubmit = data => {
        const { startTime, endTime, ...rest } = data;
        data.startTime = formatTime(startTime);
        data.endTime = formatTime(endTime);

        console.log(data);
    };

    const seq = [...Array(10)].map((_, i) => ++i);

    return(
        <>
            <Typography variant="h5" component='h1'>募集の新規作成</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <TextField
                        name="title"
                        variant="outlined"
                        label="タイトル"
                        inputRef={register({
                            required: { value: true, message: "タイトルは必須です。"　},
                            maxLength:{ value: 255, message: "タイトルには255文字までの文字列を指定してください。"　}
                        })}
                        error={errors.title}
                        helperText={errors.title && errors.title.message}
                    />
                </div>
                <div>
                    <TextField
                        name="description"
                        variant="outlined"
                        label="説明"
                        inputRef={register}
                    />
                </div>
                <div>
                    <DateTimePicker 
                        name="startTime"
                        label="開始時刻"
                        control={control}
                        watch={watch}
                        errors={errors}
                        before=""
                        after="endTime"
                    />
                </div>
                    <DateTimePicker 
                        name="endTime"
                        label="終了時刻"
                        control={control}
                        watch={watch}
                        errors={errors}
                        before="startTime"
                        after=""
                    />
                <div>
                    <CapacitySelecter
                        name="capacity"
                        label="定員"
                        control={control}
                        errors={errors}
                    />
                </div>
                <input type="submit"/>
            </form>
        </>
    );
}