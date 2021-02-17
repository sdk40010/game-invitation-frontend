import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
    }
}));

export default function CenteredCircularProgress() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <CircularProgress color="secondary" />
        </div>
    )
}