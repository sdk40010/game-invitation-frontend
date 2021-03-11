import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useForm } from "react-hook-form";

import useInvitationAPI from "../http/invitationAPI";
import useTagAPI from "../http/tagAPI";

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

    const invitationAPI = useInvitationAPI();
    const tagAPI = useTagAPI();

    const classes = useStyles();

    // タグ一覧の取得
    useEffect(() => {
        (async () => {
            await tagAPI.getAll()
        })();
    }, []);

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSubmit = async (inputs) => {
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
                    <SearchForm
                        onSubmit={handleSubmit}
                        tagOptions={tagAPI.data}
                    />
                </Box>
            </Popover>
        </>
    );
}

/**
 * フォームの入力値をクエリパラメータに変換する
 * 
 * @param {Object} inputs フォームの入力値
 * @returns {URLSearchParams} クエリパラメータ
 */
const convertToQuery = (inputs) => {
    const params = {};
    delete inputs.notEmpty;

    Object.entries(inputs).forEach(([key, value]) => {
        const formatted
            = Array.isArray(value) ? value.map(v => v.name).join(" ")
            : typeOf(value) === "Date" ? formatTime(value)
            : value;
        params[key] = formatted;
    });
    return new URLSearchParams(params);
}

/**
 * 値の型を判定する
 * 
 * @param {any} value 型の判定対象
 * @returns {string} 型の名前
 */
const typeOf = (value) => {
    return Object.prototype.toString.call(value).slice(8, -1);
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
    const { onSubmit, tagOptions } = props;

    const classes = useStyles();

    const {
        register,
        handleSubmit,
        watch,
        control,
        errors,
        setValue,
        reset, 
        formState: { dirtyFields } // 最新の状態を取得するために、描画の前に個別に状態を読み込んでおく (https://github.com/react-hook-form/react-hook-form/issues/1146)
    } = useForm({defaultValues});
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

    const handleMinStartTimeChange = createHandleChange(maxStartTimeProps);
    const handleMaxStartTimeChange = createHandleChange(minStartTimeProps);

    const handleMinCapacityChange = createHandleChange(maxCapacityProps);
    const handleMaxCapacityChange = createHandleChange(minCapacityProps);

    const handleReset = () => reset();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input name="notEmpty" hidden ref={register(hiddenInputRules)} />

            <Box mb={3}>
                <Typography variant="body2" paragraph>
                    検索対象
                </Typography>

                <TagSelector 
                    name="tags"
                    label="タグ"
                    tagOptions={tagOptions}
                    size="small"
                    {...formProps}
                />
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
                                onChange={handleMinStartTimeChange}
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
                                onChange={handleMaxStartTimeChange}
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
                                onChange={handleMinCapacityChange}
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
                                onChange={handleMaxCapacityChange}
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


