import React, { useState, useEffect } from 'react';
import DateFnsUtils from  '@date-io/date-fns';
import format from "date-fns/format";
import ja from "date-fns/locale/ja";
import {　MuiPickersUtilsProvider,　KeyboardDateTimePicker } from '@material-ui/pickers';
import { useController } from "react-hook-form";
import {
    FormControl,
    FormHelperText,
    Select,
    InputLabel,
    MenuItem,
    TextField,
    Checkbox,
} from "@material-ui/core";
import { Autocomplete, createFilterOptions } from "@material-ui/lab";
import { CheckBoxOutlineBlankOutlined, CheckBox } from "@material-ui/icons";


/**
 * 日付・時間選択用のコンポーネント
 */
export function DateTimePicker(props) {
    const { name, label, control, watch, errors, before, after } = props;
    const { field } = useController({
        name,
        control,
        rules: {
            required: true,
            validate: {
                before: time => {
                    if (after && watch(after.name)) {
                        // 秒単位の比較を防ぐために、秒数以下を切り捨てるフォーマットをかけてから比較する
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
                    error={errors[name] && true}
                    helperText={errors[name] && helperText}
                    style={{ width: "100%"}}
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
export function CapacitySelector(props) {
    const { name, label, control, watch, errors } = props;
    const { field } = useController({
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
            error={errors[name] && true}
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

/**
 * タグ選択用のコンポーネント
 */
const icon = <CheckBoxOutlineBlankOutlined fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;
const filter = createFilterOptions();

export function TagSelector(props) {
    const { name, label, watch, control, errors, data } = props;
    const { field } = useController({
        name,
        control,
        rules: {
            validate: {
                limit: tags => tags.length <= 10
            }
        },
    });

    const helperText =
        errors[name]?.type === "limit" ?
            "10個以下のタグを指定してください。" :
        "";

    // 選択肢の初期化
    const [options, setOptions] = useState([]);
    useEffect(() => {
        setOptions(data);
    }, [data])
    
    return (
        <Autocomplete
            multiple
            options={options}
            disableCloseOnSelect
            value={watch(name)}
            getOptionLabel={option => option.name}
            getOptionSelected={(option, value) => {
                if (!option.id || !value.id) {
                    // 新しいタグはidを持っていないので、名前で比較を行う
                    return option.name === value.name;
                }
                return option.id === value.id;
            }}
            renderOption={(option, { selected }) => (
                <>
                    <Checkbox 
                        icon={icon}
                        checkedIcon={checkedIcon}
                        checked={selected}
                    />
                    {option.name}
                </>
            )}
            renderInput={params => (
                <TextField
                    {...params}
                    name={name}
                    label={label}
                    variant="outlined"
                    placeholder="検索"
                    error={errors[name] && true}
                    helperText={errors[name] && helperText}
                />
            )}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const hasSameOption = filtered.some(option => option.name === params.inputValue);

                // 入力値と一致する選択肢がないときは、新しいタグを追加する選択肢も表示する
                if (params.inputValue !== "" && !hasSameOption) {
                    filtered.unshift({
                        inputValue: params.inputValue,
                        name: `${params.inputValue}を追加`
                    });
                }

                return filtered;
            }}
            onChange={(event, value) => {
                const last = value.pop();

                if (last && last.inputValue) { // 新しいタグを追加したとき
                    const newTag = { name: last.inputValue };

                    value.push(newTag);
                    setOptions(prevOptions => {
                        prevOptions.push(newTag)
                        return prevOptions;
                    });
                } else if (last) { // 既存のタグを追加したとき
                    value.push(last);
                }

                // react-hook-formに値を渡す
                field.onChange(value);
            }}
        />
    );
}

