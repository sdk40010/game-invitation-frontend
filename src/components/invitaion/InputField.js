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
    TextField
} from '@material-ui/core';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
    KeyboardTimePicker,
    KeyboardDateTimePicker
} from '@material-ui/pickers';
import { useController } from "react-hook-form";

/**
 * 日付・時間選択用のコンポーネント
 */
export function DateTimePicker({name, label, control, watch, errors, before, after}) {
    const { field, meta } = useController({
        name,
        control,
        rules: {
            required: true,
            validate: {
                before: time => {
                    if (after && watch(after)) {
                        // ミリ秒単位の比較を防ぐために、ミリ秒以下を切り捨てるフォーマットをかけてから比較する
                        const d1 = new Date(formatTime(time));
                        const d2 = new Date(formatTime(watch(after)));
                        return d1.getTime() < d2.getTime();
                    } else {
                        return true;
                    }
                },
                after: time => {
                    if (before && watch(before)) {
                        const d1 = new Date(formatTime(time));
                        const d2 = new Date(formatTime(watch(before)));
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
            "終了時刻より前の時刻を指定してください。" :
        errors[name]?.type === "after" ?
            "開始時刻より後の時刻を指定してください。" :
        "";

    return (
        <MuiPickersUtilsProvider utils={CustomDateFnsUtils}　locale={ja}>
                <KeyboardDateTimePicker
                    name={name}
                    value={watch(name) || null}
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
 * 日付や時間の表記を日本式するためのクラス
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
export function CapacitySelecter({name, label, control, errors}) {
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
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
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
                MenuProps={MenuProps}
                onChange={field.onChange}
            >
                {seq.map(i => <MenuItem key={i} value={i}>{i+"人"}</MenuItem>)}
            </Select>
            {errors[name] && <FormHelperText>{errors[name].message}</FormHelperText>}
        </FormControl>
    )
}
