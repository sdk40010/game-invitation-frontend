import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    link: {
        textDecoration: "none",
        color: "inherit",
    },
}));

/**
 * 装飾なしのリンク
 */
export default function SimpleLink({children, ...rest}) {
    const classes = useStyles();

    return (
        <Link {...rest} className={classes.link}>
            {children}
        </Link>
    );
}