import { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";

import useInvitationAPI from "./http/invitationAPI";
import useQuery from "./utils/useQuery";
import useScrollToTop from "./utils/useScrollToTop";

import MainContainer from "./utils/MainContainer";
import Heading from "./utils/Heading";
import SimpleMenu from "./utils/SimpleMenu";
import SimpleLink from "./utils/SimpleLink";

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
import { MoreVert } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    list: {
        // 募集一覧のアイテムの高さをそろえるための設定
        "& > * > *": {
            height: "100%",
        },
        "& > * > * > *": {
            height: "100%",
        }
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
    },
    subHeader: {
        "& > :not(:first-child)": {
            marginLeft: theme.spacing(1)
        }
    },
    subHeaderChip: {
        color: theme.palette.text.secondary
    },
}));

/**
 * トップページ(募集一覧ページ）
 */
export default function Top() {
    const invitationAPI = useInvitationAPI();

    const errors = [invitationAPI.error];
    const resources=[invitationAPI.data];

    const query = useQuery();

    useScrollToTop();

    // 募集一覧の取得
    useEffect(() => {
        (async () => {
            await invitationAPI.getAll(query);
        })();
    }, [query]);

    return(
        <MainContainer errors={errors} resources={resources} maxWidth="lg">
            <>
                <Box>
                    <InvitationList invitations={invitationAPI.data?.invitations} />
                </Box>

                <Box mt={4}>
                    <Paginator meta={invitationAPI.data?.meta} />
                </Box>
            </>
        </MainContainer>
    );
}

/**
 * 募集一覧
 */
export function InvitationList({ invitations }) {
    const classes = useStyles();

    return (
        <Grid container spacing={2} className={classes.list}>
            {invitations.map(invitation => (
                <InvitationListItem invitation={invitation} key={invitation.id} />
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

    const subHeader = (
        <>
            <span>{invitation.createdAt}</span>
            <Chip
                label={invitation.canParticipateIn ? "募集中" : "募集終了"}
                size="small"
                color={invitation.canParticipateIn ? "primary" : "default"}
                variant="outlined"
                className={!invitation.canParticipateIn ? classes.subHeaderChip : ""}
            />
        </>
    );
    const poster = (
        <SimpleLink to={`/users/${invitation.userId}`} display="inline-block">
            <Avatar alt={invitation.user.name} src={invitation.user.iconUrl} />
        </SimpleLink>
    );

    const menuItems = [
        {
            content: "編集",
            link: `/invitations/${invitation.id}/edit`
        }
    ];
    const action = (
        <SimpleMenu
            icon={<MoreVert />}
            iconSize="small"
            enableStopPropagation={true}
            menuItems={menuItems}
        />
    );

    const content = (
        <>
            <Box mb={1}>
                <Grid container spacing={1} wrap="nowrap" className={classes.tagContainer}>
                    {invitation.tags.map(tag => (
                        <Grid item key={tag.id}>
                            <Chip label={tag.name} size="small" />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box>
                <NestedGrid 
                    items={[
                        (<>
                            <Grid item>
                                <CustomHeading>開始時刻</CustomHeading>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2">{invitation.startIn}</Typography>
                            </Grid>
                        </>),
                        (<>
                            <Grid item>
                                <CustomHeading>時間</CustomHeading>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2">{invitation.interval}</Typography>
                            </Grid>
                        </>),
                    ]}
                />
            </Box>
            
            <Box>
                <NestedGrid 
                    items={[
                        (<>
                            <Grid item>
                                <CustomHeading>定員</CustomHeading>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2">{invitation.capacity}人</Typography>
                            </Grid>
                        </>),
                        (<>
                            <Grid item>
                                <CustomHeading>参加</CustomHeading>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2">{invitation.participantsCount}人</Typography>
                            </Grid>
                        </>)
                    ]}
                />
            </Box>
        </>
    );

    // Card内でLinkを使えるように、Card全体をクリックしたときはhistoryを使って遷移させる
    const history = useHistory();
    const handleClick = () => {
        history.push(`/invitations/${invitation.id}`);
    };

    return (
        <Grid item xs={12} sm={4} md={3} onClick={handleClick}>
            <CardActionArea disableTouchRipple>
                <Card>
                    <CardHeader 
                        title={title}
                        subheader={subHeader}
                        avatar={poster}
                        action={invitation.isPoster ? action : <></>}
                        classes={{ subheader: classes.subHeader }}
                    />
                    <CardContent
                        className={classes.cardContent}
                        component={SimpleLink}
                        to={`/invitations/${invitation.id}`}
                        display="block"
                    >
                        {content}
                    </CardContent>
                </Card>
            </CardActionArea>
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
 * 募集詳細用の入れ子グリッド
 */
function NestedGrid({items}) {
    return (
        <Grid container spacing={1} alignItems="center">
            {items.map((item, i) => (
                <Grid
                    container
                    item
                    spacing={1}
                    alignItems="center"
                    xs={12 / items.length}
                    key={i}
                >
                    {item}
                </Grid>
            ))}
        </Grid>
    );
}

/**
 * ページ一覧
 */
export function Paginator({ meta }) {
    const path = useLocation().pathname;

    return (
        <Grid container justify="center">
            <Grid item>
                <Pagination
                    page={meta.currentPage}
                    count={meta.lastPage}
                    renderItem={item => (
                        <PaginationItem
                            component={SimpleLink}
                            to={`${path}${item.page ===1 ? "" : `?page=${item.page}`}`}
                            {...item}
                        />
                    )}
                />
            </Grid>
        </Grid>
    );
}