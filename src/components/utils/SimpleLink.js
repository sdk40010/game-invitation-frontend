import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { styled } from '@material-ui/core/styles';

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    link: props => ({
        textDecoration: "none",
        color: "inherit",
        display: props.display
    }),
}));

/**
 * 装飾なしのリンク
 */
function SimpleLink(props) {
    const {
        children,
        className,
        display = null,
        forwardedRef,
        ...rest
    } = props;

    const classes = useStyles({ display: display});

    return (
        <Link 
            className={[classes.link, className ?? ""].join(" ")}
            ref={forwardedRef}
            {...rest}
        >
            {children}
        </Link>
    );
}

export default forwardRef((props, ref) => <SimpleLink {...props} forwardedRef={ref} />);