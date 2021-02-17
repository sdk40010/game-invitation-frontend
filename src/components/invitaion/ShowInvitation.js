import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/use-auth";
import useErrors from "../utils/use-erros";
import useInvitationAPI from "../http/invitationAPI";
import MainContainer from "../utils/MainContainer";
import CenteredCircularProgress from "../utils/CenteredCircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import {
    Typography,
    Card,
    CardHeader,
    CardActionArea,
    CardContent,
    Button,
    Avatar,
    Grid,
    Box
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    posterName: {
        flexGrow: 1
    },
    headerAction: {
        alignSelf: "center",
        marginTop: 0,
        marginRight: 0
    },
    posterGrid: {
        marginBottom: theme.spacing(2)
    },
    heading: {
        color: theme.palette.grey[700]
    },
    fromTo: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
}));

export default function ShowInvitation() {
    const auth = useAuth();
    const { id } = useParams();
    const invitationAPI = useInvitationAPI();
    const pageError = useErrors(invitationAPI.error, auth.error);
    const classes = useStyles();

    useEffect(() => {
        const getInvitation = async () => {
            await invitationAPI.get(id);
        }
        getInvitation();
    }, [])

    const data = invitationAPI.data || null;


    const title = data ? (
        <Typography variant="h5" component="h1">{data.title}</Typography>
    ) : (
        ""
    );

    const subHeader = data ? ( data.createdAt
    ) : (
        ""
    );

    const participationButton = data ? (
        <Button color="primary" variant="contained">参加する</Button>
    ) : (
        ""
    );

    const poster = data ? (
        <Grid
            container
            spacing={1}
            alignItems="center"
            className={classes.posterGrid}
        >
            <Grid item>
                <Avatar
                    alt={data.user.name}
                    src={data.user.iconUrl}
                />
            </Grid>
            <Grid item className={classes.posterName}>
                <Typography variant="body1">{data.user.name}</Typography>
            </Grid>
            <Grid item>
                <Button color="primary" variant="outlined">フレンド申請</Button>
            </Grid>
        </Grid>
        
    ) : (
        ""
    );

    const content = data ? (
        <>
            {data.description ? (
                <Box>
                    <Heading>説明</Heading>
                    <Typography variant="body1" paragraph>{data.description}</Typography>
                </Box>
            ) : (
                <></>
            )
            }
            <Box>
                <Heading>時間</Heading>
                <Grid container>
                    <Grid item>
                        <Typography variant="body1" paragraph>{data.startTime}</Typography>
                    </Grid>
                    <Grid item className={classes.fromTo}>〜</Grid>
                    <Grid item>
                        <Typography variant="body1" paragraph>{data.endTime}</Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box>
                <Heading>定員</Heading>
                <Typography variant="body1" paragraph>{data.capacity}人</Typography>
            </Box>
            <Box>
                <Heading>参加者</Heading>
            </Box>
        </>
    ) : (
        <CenteredCircularProgress />
    );

    return (
        <MainContainer error={pageError} maxWidth="md">
            <Card>
                <CardHeader 
                    title={title}
                    subheader={subHeader}
                    action={participationButton}
                    classes={{ action: classes.headerAction }}
                />
                <CardContent>
                    {poster}
                    {content}
                </CardContent>
            </Card>

        </MainContainer>
    );
}

/**
 * 募集の詳細用の見出し
 */
function Heading({children}) {
    const classes = useStyles();

    return (
        <Typography
            variant="caption"
            className={classes.heading}
        >
            {children}
        </Typography>
    )
}
