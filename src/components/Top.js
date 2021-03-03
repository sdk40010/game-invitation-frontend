import { useEffect } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "./auth/useAuth";
import useInvitationAPI from "./http/invitationAPI";
import useErrors from "./utils/useErros";
import useLoading from "./utils/useLoading";
import useQuery from "./utils/useQuery";
import useScrollToTop from "./utils/useScrollToTop";

import MainContainer from "./utils/MainContainer";
import Heading from "./utils/Heading";

import { makeStyles } from "@material-ui/core/styles";
import {
    Grid,
    Typography,
    CardActionArea,
    Card,
    CardHeader,
    CardContent,
    Avatar,
    Box,
    Chip,
} from "@material-ui/core";
import { Pagination, PaginationItem }from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
    link: {
        display: "block",
        textDecoration: "none",
        color: "inherit"
    },
    cardContent: {
        paddingTop: 0
    },
    tagContainer : {
        overflow: "scroll",
        "-ms-overflow-style": "none", /* IE, Edge 対応 */
        "scrollbar-width": "none",    /* Firefox 対応 */
        "&::-webkit-scrollbar" : {  /* Chrome, Safari 対応 */
            display: "none"
        }
    }
}));

/**
 * トップページ(募集一覧ページ）
 */
export default function Top() {
    const auth = useAuth();
    const invitationAPI = useInvitationAPI();

    const pageError = useErrors(auth.error, invitationAPI.error);
    const loading = useLoading(invitationAPI.data);

    const query = useQuery();

    useScrollToTop();

    // 募集一覧の取得
    useEffect(() => {
        (async () => {
            await invitationAPI.getAll(query);
        })();
    }, [query]);

    return(
        <MainContainer error={pageError} loading={loading} maxWidth="lg">
            <>
                <InvitationList invitations={invitationAPI.data?.invitations} />
                <Paginator meta={invitationAPI.data?.meta} />
            </>
        </MainContainer>
    );
}

/**
 * 募集一覧
 */
function InvitationList({ invitations }) {
    return (
        <Grid container spacing={2}>
            {invitations.map((invitation, i) => (
                <InvitationListItem invitation={invitation} key={i} />
            ))}
        </Grid>
    );
}

/**
 * 募集一覧アイテム
 */
function InvitationListItem({ invitation }) {
    const classes = useStyles();

    const title = <Typography variant="body1">{invitation.title}</Typography>
    const subHeader = invitation.createdAt;
    const poster = <Avatar alt={invitation.user.name} src={invitation.user.iconUrl} />;

    const content = (
        <>
            <Box mb={1}>
                <Grid container spacing={1} wrap="nowrap" className={classes.tagContainer}>
                    {invitation.tags.map((tag, i) => (
                        <Grid item key={i}>
                            <Chip label={tag.name} size="small" />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box>
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <CustomHeading>時間</CustomHeading>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2">
                            {invitation.startTime}
                        </Typography>
                    </Grid>
                    <Grid item>〜</Grid>
                    <Grid item>
                        <Typography variant="body2">
                            {invitation.endTime}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            
            <Box>
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <CustomHeading>定員</CustomHeading>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2">
                           {invitation.capacity}人
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </>
    )

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Link to={`/invitations/${invitation.id}`} className={classes.link}>
                <CardActionArea>
                    <Card>
                        <CardHeader 
                            title={title}
                            subheader={subHeader}
                            avatar={poster}
                        />
                        <CardContent className={classes.cardContent}>
                            {content}
                        </CardContent>
                    </Card>
                </CardActionArea>
            </Link>
        </Grid>
    );
}

/**
 * 微調整した募集詳細用の見出し
 */
function CustomHeading({children}) {
    return (
        <Heading style={{lineHeight: "normal"}}>
            {children}
        </Heading>
    )
}

/**
 * ページ一覧
 */
function Paginator({ meta }) {
    return (
        <Box mt={4}>
            <Grid container justify="center">
                <Grid item>
                    <Pagination
                        page={meta.currentPage}
                        count={meta.lastPage}
                        renderItem={item => (
                            <PaginationItem
                                component={Link}
                                to={item.page === 1 ? '' : `?page=${item.page}`}
                                {...item}
                            />
                        )}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}