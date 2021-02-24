import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import useErrors from "../utils/useErros";
import useInvitationAPI from "../http/invitationAPI";
import MainContainer from "../utils/MainContainer";
import CenteredCircularProgress from "../utils/CenteredCircularProgress";
import Heading from "../utils/Heading";
import { makeStyles } from "@material-ui/core/styles";
import {
    Typography,
    Card,
    CardHeader,
    CardContent,
    Button,
    Avatar,
    Grid,
    Box,
    Chip,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    posterName: {
        flexGrow: 1
    },
    headerAction: {
        marginTop: 0,
        marginRight: 0
    },
    posterGrid: {
        marginBottom: theme.spacing(2)
    },
}));

/**
 * 募集閲覧ページ
 */
export default function ShowInvitation() {
    const auth = useAuth();
    const invitationAPI = useInvitationAPI();
    const pageError = useErrors(invitationAPI.error, auth.error);

    const { id } = useParams();

    const classes = useStyles();

    useEffect(() => {
        const getInvitation = async () => {
            await invitationAPI.get(id);
        }
        getInvitation();
    }, [])

    const data = invitationAPI.data;

    const title = data ? (
        <Typography variant="h5" component="h1" paragraph>{data.title}</Typography>
    ) : (
        <></>
    );

    const subHeader = data ? (`${data.createdAt}に投稿`) : "";

    const participationButton = data ? (
        <Button color="primary" variant="contained">参加する</Button>
    ) : (
        <></>
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
        <></>
    );

    const content = data ? (
        <>
            <Box mb={2}>
                <Grid container spacing={1}>
                    {data.tags.map(tag => (
                        <Grid item>
                            <Chip label={tag.name} />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {data.description ? (
                <Box mb={2}>
                    <Heading>説明</Heading>
                    <Typography variant="body1">{data.description}</Typography>
                </Box>
            ) : (
                <></>
            )
            }

            <Box mb={2}>
                <Heading>時間</Heading>
                <Grid container spacing={1}>
                    <Grid item>
                        <Typography variant="body1">{data.startTime}</Typography>
                    </Grid>
                    <Grid item>〜</Grid>
                    <Grid item>
                        <Typography variant="body1">{data.endTime}</Typography>
                    </Grid>
                </Grid>
            </Box>

            <Box mb={2}>
                <Heading>定員</Heading>
                <Typography variant="body1">{data.capacity}人</Typography>
            </Box>

            <Box mb={2}>
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

