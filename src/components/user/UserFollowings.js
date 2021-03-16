import { useEffect } from "react";
import { useParams } from "react-router-dom";

import useUserAPI from "../http/userAPI";
import useFollowingAPI from "../http/followingAPI";
import useQuery from "../utils/useQuery";
import useScrollToTop from "../utils/useScrollToTop";

import MainContainer from "../utils/MainContainer";
import { Paginator } from "../Top";
import Header from "./Header";
import { UserProfile } from "../invitaion/ShowInvitation";

import {
    Box,
    Grid,
    Paper,
    CardActionArea,
} from "@material-ui/core";

export default function UserFollowings() {
    const { id } = useParams(); // ユーザーID

    const userAPI = useUserAPI(id);
    const followingAPI = useFollowingAPI();

    const errors = [userAPI.error, followingAPI.error];
    const resources = [userAPI.data?.user, userAPI.data?.pagination];

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


    return (
        <MainContainer errors={errors} resources={resources} maxWidth="lg">
            <Box mb={2}>
                <Header
                    initialTab={2}
                    user={userAPI.data?.user}
                    followingAPI={followingAPI}
                    userAPI={userAPI}
                />
            </Box>

            <Box mb={4}>
                <UserList 
                    users={userAPI.data?.pagination?.followings}
                    followingAPI={followingAPI}
                    userAPI={userAPI}
                />
            </Box>

            <Box>
                <Paginator meta={userAPI.data?.pagination?.meta} />
            </Box>
        </MainContainer>
    );
}

/**
 * ユーザー一覧
 */
export function UserList({users, followingAPI, userAPI}) {
    return (
        
        <Grid container spacing={3}>
            {users.map(user => {
                // フォロー
                const handleFollow = async () => {
                    const success1 = await followingAPI.post(user.id);
                    // ユーザープロフィールを更新するために、ユーザーをを再取得する
                    const success2 = await userAPI.get();
                    return Boolean(success1 && success2);
                }

                // フォロー取り消し
                const handleUnfollow = async () => {
                    const success1 = await followingAPI.remove(user.id);
                    const success2 = await userAPI.get();
                    return Boolean(success1 && success2);
                }

                return (
                    <Grid item xs={12} md={6}>
                        <CardActionArea>
                            <Paper>
                                <Box p={2}>
                                    <UserProfile
                                        user={user}
                                        onFollow={handleFollow}
                                        onUnfollow={handleUnfollow}
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