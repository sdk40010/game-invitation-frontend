import React from "react";
import { Container } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    appBarSpacer: theme.mixins.toolbar,
    container: {
        paddingTop: theme.spacing(4),
        paddingLeft: 0,
        paddingRight: 0,
    }
}));

export default function MainContainer({children, ...rest}) {
    const classes = useStyles();

    return (
        <Container
            component="main"
            {...rest}
        >
            <div className={classes.appBarSpacer} />
            <Container className={classes.container}>
                {children}
            </Container>
        </Container>
    )
}