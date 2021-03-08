import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    link: {
        textDecoration: "none",
        color: "inherit",
        display: "inline-block"
    },
}));

/**
 * 装飾なしのリンク
 */
export default function SimpleLink({children, display, ...rest}) {
    const classes = useStyles();

    return (
        <Link {...rest} className={classes.link} style={display ? { display } : {}}>
            {children}
        </Link>
    );
}