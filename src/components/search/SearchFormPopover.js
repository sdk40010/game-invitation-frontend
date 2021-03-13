import { useState } from "react";
import { useHistory } from "react-router-dom";

import { useForm, useController } from "react-hook-form";

import { useSearchForm } from "./useSearchForm";

import { DateTimePicker, CapacitySelector, TagSelector, formatTime } from "../invitaion/InputField";
import { createEqualOrBefore, createEqualOrAfter } from "../invitaion/InvitationForm";

import { makeStyles } from "@material-ui/core/styles";
import {
    Grid,
    TextField,
    IconButton,
    Popover,
    Typography,
    Box,
    Button,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
    paper: {
        width: "60%",
        maxWidth: "720px",
        overflow: "initial" // スクロールバーの表示を防ぐ
    },
    cardContent: {
        paddingBottom: theme.spacing(2)
    },
    buttonsWrapper: {
        "& > *:not(:last-child)": {
            marginRight: theme.spacing(1)
        }
    }
}));

/**
 * 検索フォーム用ポップオーバー
 */
export default function SearchFormPopover() {
    const history = useHistory();

    const classes = useStyles();

    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    };

    // 検索ボタンのクリックハンドラー
    const handleSearch = async (inputs) => {
        handleClose();
        const query = convertToQuery(inputs);
        history.push(`/search?${query.toString()}`);
    }

    return (
        <>
            <IconButton color="inherit" onClick={handleClick}>
                <Search />
            </IconButton>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{ className: classes.paper }}
            >
                <Box p={2}>
                    <SearchForm onSearch={handleSearch} />
                </Box>
            </Popover>
        </>
    );
}

/**
 * フォームの入力値をクエリパラメータに変換する
 * 
 * @param {Object} inputs フォームの全input
 * @returns {URLSearchParams} クエリパラメータ
 */
const convertToQuery = (inputs) => {
    delete inputs.notEmpty;
    const params = {};

    Object.entries(inputs).forEach(([name, value]) => {
        if (!value) {
            return;
        }　else if (Array.isArray(value) && value.length === 0) {
            return;
        }
        // URLを短くするためにクエリパラメータの変数名は省略形にする
        params[abbreviations[name]] = toString(name, value);
    });
    return new URLSearchParams(params);
}

// クエリパラメータの変数名一覧（元の形 -> 省略形）
const abbreviations = {
    tags: "tags",
    title: "title",
    minStartTime: "minst",
    maxStartTime: "maxst",
    minCapacity: "minc",
    maxCapacity: "maxc",
}

/**
 *  inputの値を文字列に変換する
 * 
 * @param {string} name - inputの名前
 * @param {any} value - inputの値
 * @returns 
 */
const toString = (name, value) => {
    switch (name) {
        case "tags":
            return value.map(tag => tag.name).join(" ")
        case "minStartTime":
        case "maxStartTime":
            return formatTime(value)
        default:
            return value.toString()
    }
}

const defaultValues = {
    title: "",
    minStartTime: null,
    maxStartTime: null,
    minCapacity: "",
    maxCapacity: "",
    tags: []
};

/**
 * 検索フォーム
 */
function SearchForm(props) {
    const { onSearch } = props;

    const searchForm = useSearchForm();

    const classes = useStyles();

    const {
        register,
        handleSubmit,
        watch,
        control,
        errors,
        setValue,
        getValues,
        reset, 
        formState: { dirtyFields }
    } = useForm({ defaultValues: searchForm.inputs ?? defaultValues });
    const formProps = { watch, control, errors };

    const hiddenInputRules = {
        validate: {
            // 最低でも1つ以上のフィールドに入力値がないと送信できないようにする
            notEmpty: () => Object.keys(dirtyFields).length !== 0
        }
    }

    const minStartTimeProps = { name: "minStartTime", label: "開始時刻の最小値" };
    const maxStartTimeProps = { name: "maxStartTime", label: "開始時刻の最大値" };

    const minCapacityProps = { name: "minCapacity", label: "定員の最小値" };
    const maxCapacityProps = { name: "maxCapacity", label: "定員の最大値" };

    // ペアのフィールドと値を同期するためのイベントハンドラーを生成する
    const createHandleChange = (pair) => {
        return (value) => {
            if (pair && !watch(pair.name)) { // ペアの値が空のときは同じ値を設定する
                setValue(pair.name, value);
            } else if (pair && !value) { // 値が空になるときはペアの値も空にする
                setValue(pair.name, null);
            }
        }
    }

    const onSearchWithSaving = (inputs) => {
        onSearch(inputs);
        searchForm.save(getValues());　// 検索ボタンをクリックしたとき入力値を保存する
    }

    const handleReset = () => {
        reset(defaultValues);
        searchForm.reset();
    };

    return (
        <form onSubmit={handleSubmit(onSearchWithSaving)}>
            <input name="notEmpty" hidden ref={register(hiddenInputRules)} />

            <Box mb={3}>
                <Typography variant="body2" paragraph>
                    検索対象
                </Typography>

                <Grid container spacing={1} alignItems="center" wrap="nowrap">
                    <Grid item xs>
                        <TagSelector 
                            name="tags"
                            label="タグ"
                            tagOptions={searchForm.tags}
                            size="small"
                            {...formProps}
                        />
                    </Grid>

                    <Grid item>
                        {/* <OperatorSelector
                            name="tags.operator"
                            {...formProps}
                        /> */}
                    </Grid>
                </Grid>
                
            </Box>

            <Box mb={2}>
                <Typography variant="body2" paragraph>
                    検索条件
                </Typography>

                <Box mb={3}>
                    <TextField
                        name="title"
                        label="タイトル"
                        variant="outlined"
                        fullWidth
                        size="small"
                        inputRef={register}
                    />
                </Box>

                <Box mb={3}>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item xs>
                            <DateTimePicker 
                                name={minStartTimeProps.name}
                                label={minStartTimeProps.label}
                                size="small"
                                equalOrBefore={createEqualOrBefore(
                                    watch(maxStartTimeProps.name),
                                    maxStartTimeProps.label
                                )}
                                onChange={createHandleChange(maxStartTimeProps)}
                                {...formProps}
                            />
                        </Grid>
                        
                        <Grid item >
                            <Typography variant="body1" component="span">〜</Typography>
                        </Grid>
                    
                        <Grid item xs>
                            <DateTimePicker 
                                name={maxStartTimeProps.name}
                                label={maxStartTimeProps.label}
                                size="small"
                                equalOrAfter={createEqualOrAfter(
                                    watch(minStartTimeProps.name),
                                    minStartTimeProps.label
                                )}
                                onChange={createHandleChange(minStartTimeProps)}
                                {...formProps}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Box>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item xs>
                            <CapacitySelector 
                                name={minCapacityProps.name}
                                label={minCapacityProps.label}
                                size="small"
                                equalOrLess={(min) => {
                                    const max = watch(maxCapacityProps.name);
                                    if (max) {
                                        return min <= max || `${maxCapacityProps.label}以下の人数を指定してください。`;
                                    }
                                    return true;
                                }}
                                onChange={createHandleChange(maxCapacityProps)}
                                {...formProps}
                            />
                        </Grid>
                        
                        <Grid item>
                            <Typography variant="body1" component="span">〜</Typography>
                        </Grid>
                        
                        <Grid item xs>
                            <CapacitySelector 
                                name={maxCapacityProps.name}
                                label={maxCapacityProps.label}
                                size="small"
                                equalOrMore={(max) => {
                                    const min = watch(minCapacityProps.name);
                                    if (min) {
                                        return max >= min || `${minCapacityProps.label}以上の人数を指定してください。`;
                                    }
                                    return true;
                                }}
                                onChange={createHandleChange(minCapacityProps)}
                                {...formProps}
                            />
                        </Grid>
                    </Grid>
                </Box>
                    
            </Box>

            <Box>
                <Grid container justify="flex-end">
                    <Grid item className={classes.buttonsWrapper}>
                        <Button color="primary" onClick={handleReset}>リセット</Button>
                        <Button variant="contained" color="primary" type="submit">検索</Button>
                    </Grid>
                </Grid>
            </Box>

        </form>
    )
}

function OperatorSelector(props) {
    const { name, watch, control } = props;
    const { field } = useController({ name, control });

    return (
        <ToggleButtonGroup
            exclusive
            size="small"
            value={watch(name)}
            onChange={field.onChange}
        >
            <ToggleButton value="or">OR</ToggleButton>
            <ToggleButton value="and">AND</ToggleButton>
        </ToggleButtonGroup>
    );
}


