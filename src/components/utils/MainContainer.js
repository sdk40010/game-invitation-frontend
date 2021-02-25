import React from "react";
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
 * errorプロパティでページ内で発生したエラーを表すオブジェクトを受け取り、
 * エラー発生時には、childrenプロパティの代わりにエラーページを表示する
 */
export default function MainContainer({children, error, maxWidth, ...rest}) {
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
                ) : (
                    children
                )}
            </Box>

        </Container>
    )
}