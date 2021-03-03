import { useForm } from "react-hook-form";

import { DateTimePicker, CapacitySelector, TagSelector } from "./InputField";
import {
    TextField,
    Button,
    Grid,
} from "@material-ui/core";

/**
 * 募集投稿フォーム
 */
export default function InvitationForm(props) {
    const { onSubmit, defaultValues, tagOptions, buttonLabel } = props;

    const { register, handleSubmit, watch, control, errors } = useForm({ defaultValues });

    return (
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
                        multiline
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
                        tagOptions={tagOptions}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button variant="contained" color="primary" type="submit">{buttonLabel}</Button>
                </Grid>

            </Grid>
        </form>
    );
}