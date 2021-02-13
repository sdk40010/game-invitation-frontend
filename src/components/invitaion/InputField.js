import React from 'react';
import DateFnsUtils from  '@date-io/date-fns';
import format from "date-fns/format";
import ja from "date-fns/locale/ja";
import { FormControl, FormHelperText, Select, InputLabel, MenuItem } from '@material-ui/core';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
    KeyboardTimePicker,
    KeyboardDateTimePicker
} from '@material-ui/pickers';
import { useController } from "react-hook-form";

export function DatePicker({name, label, control, watch, errors}) {
    const { field, meta } = useController({
        name,
        control,
        rules: {
            required: true,
            validate: {
                future: date => date > new Date()
            }
        },
    });

    const helperText = 
        errors[name]?.type === "required" ?
            `${label}は必須です。` :
        errors[name]?.type === "future" ?
            "過去の日付は指定できません。" :
         "";

      return (
            <MuiPickersUtilsProvider utils={CustomDateFnsUtils}　locale={ja}>
                <KeyboardDatePicker
                    name={name}
                    value={watch(name) || null}
                    inputVariant="outlined"
                    label={label}
                    format="yyyy/M/d"
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

export function TimePicker({name, label, control, watch, errors, before, after}) {
    const { field, meta } = useController({
        name,
        control,
        rules: {
            required: true,
            validate: {
                before: time => after ? time < watch(after) : true,
                after: time => before ? time > watch(before) : true,
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
                <KeyboardTimePicker 
                    name={name}
                    value={watch(name) || null}
                    inputVariant="outlined"
                    label={label}
                    format="HH:mm"
                    ampm={false}
                    okLabel="決定"
                    cancelLabel="キャンセル"
                    autoOk={true}
                    onChange={field.onChange}
                    error={errors[name]}
                    helperText={errors[name] && helperText}
                />
            </MuiPickersUtilsProvider>
        );
}

export function DateTimePicker({name, label, control, watch, errors, before, after}) {
    const { field, meta } = useController({
        name,
        control,
        rules: {
            required: true,
            validate: {
                before: time => after ? time < watch(after) : true,
                after: time => before ? time > watch(before) : true,
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

// export function formatDate(date) {
//     return format(date, "yyyy/MM/dd") ;
// }

// export function formatTime(time) {
//     return format(time, "HH:mm") ;
// }

export function formatTime(time) {
    return format(time, "yyyy/MM/dd HH:mm");
}

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

    return (
        <FormControl
            variant="outlined"
            error={errors[name]}
        >
            <InputLabel >{label}</InputLabel>
            <Select onChange={field.onChange}>
                {seq.map(i => <MenuItem key={i} value={i}>{i+"人"}</MenuItem>)}
            </Select>
            {errors[name] && <FormHelperText>{errors[name].message}</FormHelperText>}
      </FormControl>
    )
}