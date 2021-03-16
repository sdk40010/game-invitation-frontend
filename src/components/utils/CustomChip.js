import { makeStyles } from "@material-ui/core/styles";
import { Chip, Box } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    chip: {
        color: theme.palette.text.secondary,
    }
}));

export default function CustomChip(props) {
    const {
        textSecondary = false,
        ml = null,
        ...rest 
    } = props;

    const classes = useStyles();

    return (
        <Chip 
            {...rest}
            className={clsx({ [classes.chip]: textSecondary })}
            component={Box}
            ml={ml}
        />
    );
}