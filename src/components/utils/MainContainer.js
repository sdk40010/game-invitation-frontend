import CenteredCircularProgress from "../utils/CenteredCircularProgress";

import {
    Container,
    Box,
    Card,
    CardHeader,
    CardContent,
    Typography
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    main: {
        marginBottom: theme.spacing(4)
    },
    appBarSpacer: theme.mixins.toolbar,
    wrapper : {
        marginTop: theme.spacing(4),
        paddingLeft: 0,
        paddingRight: 0,
    }
}));

/**
 * mainタグを表すコンポーネント
 * 
 * @param {Error} props.error - ページ内で発生したエラー
 * @param {boolean} props.loading - APIリソースの読み込み状況
 * @param {string} props.maxWidth - mainタグの横幅の最大値を示す文字列
 */
export default function MainContainer(props) {
    const {children, error, loading, maxWidth, ...rest} = props;

    const classes = useStyles();

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
                    <CenteredCircularProgress />
                ) : (
                    children
                )}
            </Box>

        </Container>
    )
}