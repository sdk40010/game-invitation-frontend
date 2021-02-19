import React from 'react';
import DateFnsUtils from  '@date-io/date-fns';
import format from "date-fns/format";
import ja from "date-fns/locale/ja";
import {
    FormControl,
    FormHelperText,
    Select,
    InputLabel,
    MenuItem,
} from '@material-ui/core';
import {　MuiPickersUtilsProvider,　KeyboardDateTimePicker　} from '@material-ui/pickers';
import { useController } from "react-hook-form";

/**
 * 日付・時間選択用のコンポーネント
 */
export function DateTimePicker(props) {
    const { name, label, control, watch, errors, before, after } = props;
    const { field, meta } = useController({
        name,
        control,
        defaultValue: null,
        rules: {
            required: true,
            validate: {
                before: time => {
                    if (after && watch(after.name)) {
                        // ミリ秒単位の比較を防ぐために、ミリ秒以下を切り捨てるフォーマットをかけてから比較する
                        const d1 = new Date(formatTime(time));
                        const d2 = new Date(formatTime(watch(after.name)));
                        return d1.getTime() < d2.getTime();
                    } else {
                        return true;
                    }
                },
                after: time => {
                    if (before && watch(before.name)) {
                        const d1 = new Date(formatTime(time));
                        const d2 = new Date(formatTime(watch(before.name)));
                        return d1.getTime() > d2.getTime();
                    } else {
                        return true;
                    }
                }
            }
        },
    });
    
    const helperText =
        errors[name]?.type === "required" ?
            `${label}は必須です。` :
        errors[name]?.type === "before" ?
            `${after.label}より前の時刻を指定してください。` :
        errors[name]?.type === "after" ?
            `${before.label}より後の時刻を指定してください。` :
        "";

    return (
        <MuiPickersUtilsProvider utils={CustomDateFnsUtils}　locale={ja}>
                <KeyboardDateTimePicker
                    name={name}
                    value={watch(name)}
                    inputVariant="outlined"
                    label={label}
                    format="yyyy/MM/dd HH:mm"
                    ampm={false}
                    okLabel="決定"
                    cancelLabel="キャンセル"
                    autoOk={true}
                    minDate={new Date()}
                    onChange={field.onChange}
                    error={errors[name]}
                    helperText={errors[name] && helperText}
                />
            </MuiPickersUtilsProvider>
    );
}

/**
 * 日付や時間の表記を日本式にするためのクラス
 */
class CustomDateFnsUtils extends DateFnsUtils {
    getCalendarHeaderText(date) {
      return format(date, "yo MMM", { locale: this.locale });
    }

    getDateTimePickerHeaderText(date) {
        return format(date, "MM/dd", { locale: this.locale })
    }
  
    getYearText(date) {
        return format(date, "yyyy", { locale: this.locale });
    }
}

/**
 * Date型の値をyyyy-MM-dd HH:mm:ss形式の文字列に変換する
 * 秒数は切り捨てて0にする
 * @param {Date} time 
 */
export function formatTime(time) {
    return format(time.setSeconds(0), "yyyy-MM-dd HH:mm:ss");
}

/**
 * 定員選択用のコンポーネント
 */
export function CapacitySelecter(props) {
    const { name, label, control, watch, errors } = props;
    const { field, meta } = useController({
        name,
        control,
        rules: {
            required: { value: true, message: "定員は必須です。"　},
            min: { value: 1, message: "定員には1以上の数値を指定してください。"},
            max: { value: 10, message: "定員には10以下の数値を指定してください。"}
        },
    });
    
    const seq = [...Array(10)].map((_, i) => ++i);
    const ITEM_HEIGHT = 36;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP,
          width: 250,
        },
      },
    };

    return (
        <FormControl
            variant="outlined"
            fullWidth
            error={errors[name]}
        >
            <InputLabel id="label">{label}</InputLabel>
            <Select
                labelId="label"
                name={name}
                value={watch(name)}
                MenuProps={MenuProps}
                onChange={field.onChange}
            >
                {seq.map(i => <MenuItem key={i} value={i}>{i+"人"}</MenuItem>)}
            </Select>
            {errors[name] && <FormHelperText>{errors[name].message}</FormHelperText>}
        </FormControl>
    )
}
