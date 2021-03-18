import { useForm } from "react-hook-form";

import { DateTimePicker, CapacitySelector, TagSelector } from "./InputField";

import { makeStyles } from "@material-ui/core/styles"
import {
    TextField,
    Button,
    Grid,
    Box,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    startTimePicker: {
        [theme.breakpoints.up('sm')]: {
            marginRight: theme.spacing(2)
        }
    }
}));

/**
 * 募集投稿フォーム
 */
export default function InvitationForm(props) {
    const {
        onSubmit,
        defaultValues,
        tagOptions,
        buttonLabel,
        fieldOptions = {}
    } = props;

    const classes = useStyles();

    const { register, handleSubmit, watch, control, errors } = useForm({ defaultValues });
    const formProps = { watch, control, errors };

    const startTimeProps = { name: "startTime", label:"開始時刻"};
    const endTimeProps = { name: "endTime", label:"終了時刻"};

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb={3}>
                <TextField
                    name="title"
                    variant="outlined"
                    fullWidth
                    label="タイトル"
                    inputRef={register({
                        required: { value: true, message: "タイトルは必須です。"　},
                        maxLength:{ value: 255, message: "タイトルには255文字までの文字列を指定してください。"　}
                    })}
                    error={Boolean(errors.title)}
                    helperText={errors.title && errors.title.message}
                />
            </Box>

            <Box mb={3}>
                <TextField
                    name="description"
                    variant="outlined"
                    fullWidth
                    label="説明"
                    inputRef={register}
                    multiline
                />
            </Box>

            
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <Box mb={3} className={classes.startTimePicker}>
                        <DateTimePicker 
                            name={startTimeProps.name}
                            label={startTimeProps.label}
                            required
                            equalOrBefore={createEqualOrBefore(
                                watch(endTimeProps.name),
                                endTimeProps.label
                            )}
                            {...formProps}
                        />
                    </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Box mb={3}>
                        <DateTimePicker 
                            name={endTimeProps.name}
                            label={endTimeProps.label}
                            required
                            equalOrAfter={createEqualOrAfter(
                                watch(startTimeProps.name),
                                startTimeProps.label
                            )}
                            {...formProps}
                        />
                    </Box>
                </Grid>
            </Grid>

            <Box mb={3}>
                <CapacitySelector
                    name="capacity"
                    label="定員"
                    min={fieldOptions.capacityMin}
                    required
                    {...formProps}
                />
            </Box>

            <Box mb={3}>
                <TagSelector 
                    name="tags"
                    label="タグ"
                    tagOptions={tagOptions}
                    {...formProps}
                />
            </Box>

            <Box>
                <Grid container justify="flex-end">
                    <Grid item>
                        <Button variant="contained" color="primary" type="submit">{buttonLabel}</Button>
                    </Grid>
                </Grid>
            </Box>
        </form>
    );
}

/**
 * 指定された時刻以前の時刻であるかどうかを判定する関数を生成する
 * 
 * @param {Date} endTime 比較対象の時刻
 * @param {string} label テキストフィールドのラベル名
 * @returns {Function}
 */
export　const createEqualOrBefore = (endTime, label) => {
    return (startTime) => {
        if (endTime) {
            // 秒単位の比較を防ぐために、秒数以下を切り捨てる
            return startTime.setSeconds(0) <= endTime.setSeconds(0)
                || `${label}以前の時刻を指定してください。`;
        }
        return true;
    }
}

/**
 * 指定された時刻以降の時刻であるかどうかを判定する関数を生成する
 * 
 * @param {Date} startTime 比較対象の時刻
 * @param {string} label テキストフィールドのラベル名
 * @returns {Function}
 */
export const createEqualOrAfter = (startTime, label) => {
    return (endTime) => {
        if (startTime) {
            return endTime.setSeconds(0) >= startTime.setSeconds(0)
                || `${label}以降の時刻を指定してください。`;
        }
        return true;
    }
}