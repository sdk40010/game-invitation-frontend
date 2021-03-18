import { useState, useEffect } from 'react';
import DateFnsUtils from  '@date-io/date-fns';
import format from "date-fns/format";
import ja from "date-fns/locale/ja";
import {　MuiPickersUtilsProvider,　KeyboardDateTimePicker } from '@material-ui/pickers';
import { useController } from "react-hook-form";
import {
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
    const {
        name,
        label,
        size = "medium",
        required = false,
        equalOrBefore = () => {},
        equalOrAfter = () => {},
        onChange = () => {},
        control,
        watch,
        errors
    } = props;

    const { field } = useController({
        name,
        control,
        rules: {
            required : { value: required, message: `${label}は必須です。` },
            validate: {
                validDate: time => {
                    if (!time) {
                        return true;
                    }
                    return !isNaN(time.getTime()) || "有効な時刻を指定してください。";
                },
                equalOrbefore: time => equalOrBefore(time) ?? true,
                equalOrAfter: time => equalOrAfter(time) ?? true
            }
        },
    });

    const handleChange = (time) => {
        field.onChange(time);
        onChange(time);
    }

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
                onChange={handleChange}
                error={errors[name] && true}
                helperText={errors[name] && errors[name].message}
                fullWidth
                size={size}
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
 * 
 * @param {Date} time 
 */
export function formatTime(time) {
    return format(time.setSeconds(0), "yyyy-MM-dd HH:mm:ss"); 
}

const ITEM_HEIGHT = 36;
const ITEM_PADDING_TOP = 8;

/**
 * 定員選択用のコンポーネント
 */
export function CapacitySelector(props) {
    const {
        name,
        label,
        size = "medium",
        min = 1,
        max = 10,
        required = false,
        equalOrLess = () => {},
        equalOrMore = () => {},
        onChange = () => {},
        control,
        watch,
        errors 
    } = props;

    const { field } = useController({
        name,
        control,
        rules: {
            required: { value: required, message: `${label}は必須です。` },
            min: { value: min, message: `${label}には${min}人以上の人数を指定してください。` },
            max: { value: max, message: `${label}には${max}以下の人数を指定してください。` },
            validate: {
                equalOrLess: capacity => equalOrLess(capacity) ?? true,
                equalOrMore: capacity => equalOrMore(capacity) ?? true
            }
        },
    });

    const handleChange = (event) => {
        field.onChange(event);
        onChange(event.target.value);
    }
    
    const seq = [...Array(max - min + 1)].map((_, i) => i + min);

    const SelectProps = {
        MenuProps: {
            PaperProps: {
                style: {
                    maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP,
                },
            },
        }
    }

    return (
        <TextField
            name={name}
            label={label}
            value={watch(name)}
            select
            variant="outlined"
            fullWidth
            SelectProps={SelectProps}
            size={size}
            onChange={handleChange}
            error={Boolean(errors[name])}
            helperText={errors[name] && errors[name].message}
        >
            {seq.map(i => <MenuItem key={i} value={i}>{i+"人"}</MenuItem>)}
        </TextField>
    );
}

/**
 * タグ選択用のコンポーネント
 */
const icon = <CheckBoxOutlineBlankOutlined fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;
const filter = createFilterOptions();

export function TagSelector(props) {
    const {
        name,
        label,
        tagOptions,
        size = "medium",
        watch,
        control,
        errors
    } = props;
    const { field } = useController({
        name,
        control,
        rules: {
            validate: {
                limit: tags => tags.length <= 10 || "10個以下のタグを指定してください。"
            }
        },
    });

    // 選択肢の初期化
    const [options, setOptions] = useState([]);
    useEffect(() => {
        setOptions(tagOptions);
    }, [tagOptions]);


    return (
        <Autocomplete
            multiple
            options={options}
            disableCloseOnSelect
            value={watch(name)}
            ChipProps={size ? { size }: {}}
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
                    size={size}
                    placeholder="検索"
                    error={errors[name] && true}
                    helperText={errors[name] && errors[name].message}
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
                        prevOptions.push(newTag);
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

