import { useState, useEffect } from "react";

import { useAuth } from "../auth/useAuth";
import { useSearchForm } from "../search/useSearchForm";
import useLoading from "../utils/useLoading";
 
import { makeStyles } from "@material-ui/core/styles";
import {
    Container,
    Box,
    Card,
    CardHeader,
    CardContent,
    Typography,
    CircularProgress
} from "@material-ui/core"


const useStyles = makeStyles((theme) => ({
    main: {
        marginBottom: theme.spacing(4)
    },
    appBarSpacer: theme.mixins.toolbar,
    wrapper : {
        marginTop: theme.spacing(4),
        paddingLeft: 0,
        paddingRight: 0,
    },
    proggresWrapper: {
        display: "flex",
        justifyContent: "center"
    }
}));

/**
 * mainタグを表すコンポーネント
 * 
 * @param {Error[]} props.errors - ページ内で発生する可能性があるエラーの配列
 * @param {boolean} props.resources - 初回の描画時に読み込むAPIリソース
 * @param {string} props.maxWidth - 横幅の最大値を示す文字列
 */
export default function MainContainer(props) {
    const {
        children,
        errors = [],
        resources = [],
        maxWidth = "md",
        ...rest
    } = props;

    const auth = useAuth();
    const searchForm = useSearchForm();

    const classes = useStyles();

    // ページ内で発生したエラー
    const [error, setError] = useState(null);

    // どのページでも発生しうる認証エラーと検索フォームエラーを追加する
    errors.push(auth.error, searchForm.error); 

    useEffect(() => {
        for (let i = 0; i < errors.length; i++) {
            if (errors[i]) {
                setError(errors[i]);
                break;
            } else if (i === errors.length - 1) {
                setError(null);
            }
        }
    }, [errors, searchForm.error]);


    // APIリソースの読み込み状況
    const loading = useLoading(resources);

    return (
        <Container
            component="main"
            maxWidth={error ? "xs" : maxWidth}
            className={classes.main}
            {...rest}
        >
            <div className={classes.appBarSpacer} />

            <Box className={classes.wrapper}>
                {error ? (
                    <Card>
                        <CardHeader
                            title={<Typography variant="h6" component="h1">エラー</Typography>}
                        />
                        <CardContent>
                            <Typography variant="body1">{error.message}</Typography>
                        </CardContent>
                    </Card>
                ) : 
                loading ? (
                    <div className={classes.proggresWrapper}>
                        <CircularProgress color="secondary" />
                    </div>
                ) : (
                    children
                )}
            </Box>

        </Container>
    )
}
