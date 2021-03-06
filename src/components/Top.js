import { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";

import useInvitationAPI from "./http/invitationAPI";
import useQuery from "./utils/useQuery";
import useScrollToTop from "./utils/useScrollToTop";

import MainContainer from "./utils/MainContainer";
import Heading from "./utils/Heading";
import SimpleMenu from "./utils/SimpleMenu";
import SimpleLink from "./utils/SimpleLink";
import CustomChip from "./utils/CustomChip";

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
    Button,
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
    noItemMessage: {
        textAlign: "center"
    },
    cardHeaderContent: {
        minWidth: 0
    },
    smallIconButton: {
        padding: 0
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
    // アイコン用
    sm: {
        width: theme.spacing(4),
        height: theme.spacing(4),
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

    const noItemMessage = (
        <>
            <Typography variant="h5" component="div" paragraph>
                現在表示できる募集がありません
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
                募集を新規作成してみましょう
            </Typography>
            <SimpleLink to="/invitations/new">
                <Button color="primary" variant="contained">新規作成</Button>
            </SimpleLink>
        </>
    );

    return(
        <MainContainer errors={errors} resources={resources} maxWidth="lg">
            <Box mb={4}>
                <InvitationList
                    invitations={invitationAPI.data?.invitations}
                    noItemMessage={noItemMessage}
                    />
            </Box>

            <Box>
                <Paginator meta={invitationAPI.data?.meta} />
            </Box>
        </MainContainer>
    );
}

/**
 * 募集一覧
 */
export function InvitationList({ invitations, noItemMessage = <></> }) {
    const classes = useStyles();

    if (invitations.length === 0) {
        return (
            <Grid container justify="center">
                <Grid item>
                    <Box mt={30} className={classes.noItemMessage}>
                        {noItemMessage}
                    </Box>
                </Grid>
            </Grid>
        );
    }

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

    const title = <Typography variant="body1" noWrap>{invitation.title}</Typography>

    const subHeader = (
        <>
            <span>{invitation.createdAt}</span>
            <CustomChip
                label={invitation.canParticipateIn ? "募集中" : "募集終了"}
                size="small"
                color={invitation.canParticipateIn ? "primary" : "default"}
                variant="outlined"
                textSecondary={!invitation.canParticipateIn}
                ml={1}
            />
        </>
    );

    const handlePosterClick = (event) => {
        event.stopPropagation();
    }
    const poster = (
        <SimpleLink
            to={`/users/${invitation.userId}`}
            display="inline-block"
            onClick={handlePosterClick}
        >
            <Avatar
                alt={invitation.user.name}
                src={invitation.user.iconUrl}
                className={classes.sm}
            />
        </SimpleLink>
    );

    const menuItems = [
        {
            content: "編集",
            link: `/invitations/${invitation.id}/edit`
        }
    ];
    const IconButtonProps = {
        size: "small",
        classes: { sizeSmall: classes.smallIconButton }
    }
    const action = (
        <SimpleMenu
            icon={<MoreVert />}
            IconButtonProps={IconButtonProps}
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
    const handleCardClick = () => {
        history.push(`/invitations/${invitation.id}`);
    };

    const handleContentClick = (event) => {
        event.stopPropagation();
    }

    return (
        <Grid item xs={12} sm={4} md={3} onClick={handleCardClick}>
            <CardActionArea disableTouchRipple>
                <Card>
                    <CardHeader 
                        title={title}
                        subheader={subHeader}
                        avatar={poster}
                        action={invitation.isPoster ? action : <></>}
                        classes={{ content: classes.cardHeaderContent }}
                    />
                    <CardContent
                        className={classes.cardContent}
                        component={SimpleLink}
                        to={`/invitations/${invitation.id}`}
                        display="block"
                        onClick={handleContentClick}
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
    const { pathname, search } = useLocation();

    if (meta.lastPage === 1) {
        return <></>;
    }

    const renderItem = (item) => {
        const query = new URLSearchParams(search);
        query.delete("page");

        if (item.page !== 1) {
            query.append("page", item.page);
        }
        const queryString = query.toString() ? `?${query.toString()}` : "";
        
        return (
            <PaginationItem
                component={SimpleLink}
                to={pathname + queryString}
                {...item}
            />
        );
    }

    return (
        <Grid container justify="center">
            <Grid item>
                <Pagination
                    page={meta.currentPage}
                    count={meta.lastPage}
                    renderItem={renderItem}
                />
            </Grid>
        </Grid>
    );
}
