import { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

import useUserAPI from "../http/userAPI";
import useFollowingAPI from "../http/followingAPI";
import useQuery from "../utils/useQuery";
import useScrollToTop from "../utils/useScrollToTop";
import { useSnackbar } from "../utils/useOpenState";

import MainContainer from "../utils/MainContainer";
import { Paginator } from "../Top";
import Header from "./Header";
import UserProfile from "../invitaion/UserProfile";

import {
    Box,
    Grid,
    Paper,
    CardActionArea,
    Snackbar,
} from "@material-ui/core";

export default function UserFollowings() {
    const { id } = useParams(); // ユーザーID

    const userAPI = useUserAPI(id);
    const followingAPI = useFollowingAPI();

    const errors = [userAPI.error, followingAPI.error];
    const resources = [userAPI.data?.user, userAPI.data?.pagination];

    const snackbar = useSnackbar();

    const query = useQuery();

    useScrollToTop();

    // ユーザーを取得する
    useEffect(() => {
        (async () => {
            userAPI.get();
        })();
    }, []);

    // ユーザーのフォロー一覧を取得する
    useEffect(() => {
        (async () => {
            userAPI.getFollowings(query);
        })();
    }, [query]);

    // フォロー一覧の更新
    const handleFollowingListUpdate = async () => {
        const success = await userAPI.getFollowings(query);
        return Boolean(success);
    }

    return (
        <MainContainer errors={errors} resources={resources} maxWidth="lg">
            <Box mb={2}>
                <Header
                    initialTab={2}
                    user={userAPI.data?.user}
                    snackbar={snackbar}
                    followingAPI={followingAPI}
                    userAPI={userAPI}
                    onUserListUpdate={handleFollowingListUpdate}
                />
            </Box>

            <Box mb={4}>
                <UserList 
                    users={userAPI.data?.pagination?.followings}
                    snackbar={snackbar}
                    followingAPI={followingAPI}
                    userAPI={userAPI}
                    onUserListUpdate={handleFollowingListUpdate}
                />
            </Box>

            <Box>
                <Paginator meta={userAPI.data?.pagination?.meta} />
            </Box>

            <Snackbar 
                anchorOrigin={{ vertical: "bottom", horizontal: "left"}}
                open={snackbar.open}
                message={snackbar.message}
                autoHideDuration={3000}
                onClose={snackbar.handleClose}
            />
        </MainContainer>
    );
}

/**
 * ユーザー一覧
 */
export function UserList({users, snackbar, followingAPI, userAPI, onUserListUpdate}) {
    const history = useHistory();

    return (
        <Grid container spacing={3}>
            {users.map(user => {
                // フォロー
                const handleFollow = async () => {
                    const success1 = await followingAPI.post(user.id);
                    // ユーザープロフィールとユーザー一覧をを更新するために、リソースをを再取得する
                    const success2 = await userAPI.get();
                    const success3 = await onUserListUpdate();
                    return Boolean(success1 && success2 && success3);
                }

                // フォロー取り消し
                const handleUnfollow = async () => {
                    const success1 = await followingAPI.remove(user.id);
                    const success2 = await userAPI.get();
                    const success3 = await onUserListUpdate();
                    return Boolean(success1 && success2 && success3);
                }

                // ユーザープロフィール内でリンクを使えるように、historyでページ遷移させる
                const handleClick = () => {
                    history.push(`/users/${user.id}`);
                }

                return (
                    <Grid item xs={12} md={6} onClick={handleClick} key={user.id}>
                        <CardActionArea disableTouchRipple>
                            <Paper>
                                <Box p={2}>
                                    <UserProfile
                                        user={user}
                                        snackbar={snackbar}
                                        onFollow={handleFollow}
                                        onUnfollow={handleUnfollow}
                                        enableStopPropagation={true}
                                    />
                                </Box>
                            </Paper>
                        </CardActionArea>
                    </Grid>
                );
            })}
        </Grid>
    );
}