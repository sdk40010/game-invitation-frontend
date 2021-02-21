import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {　Typography　} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    heading: {
        color: theme.palette.grey[700],
        fontSize: ".75rem"
    }
}));

/**
 * 募集詳細用の見出し
 */
export default function Heading({children, ...rest}) {
    const classes = useStyles();

    return (
        <Typography
            variant="subtitle2"
            component="div"
            className={classes.heading}
            {...rest}
            // gutterBottom
        >
            {children}
        </Typography>
    );
}