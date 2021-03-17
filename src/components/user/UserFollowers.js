import { useEffect } from "react";
import { useParams } from "react-router-dom";

import useUserAPI from "../http/userAPI";
import useFollowingAPI from "../http/followingAPI";
import useQuery from "../utils/useQuery";
import useScrollToTop from "../utils/useScrollToTop";
import { useSnackbar } from "../utils/useOpenState";

import MainContainer from "../utils/MainContainer";
import { Paginator } from "../Top";
import Header from "./Header";
import { UserList } from "./UserFollowings";

import {
    Box,
    Snackbar,
} from "@material-ui/core";

export default function UserFollowers() {
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
            userAPI.getFollowers(query);
        })();
    }, [query]);

    // フォロワー一覧の更新
    const handleFollowerListUpdate = async () => {
        const success = await userAPI.getFollowers(query);
        return Boolean(success);
    }


    return (
        <MainContainer errors={errors} resources={resources} maxWidth="lg">
            <Box mb={2}>
                <Header
                    initialTab={3}
                    user={userAPI.data?.user}
                    snackbar={snackbar}
                    followingAPI={followingAPI}
                    userAPI={userAPI}
                    onUserListUpdate={handleFollowerListUpdate}
                />
            </Box>

            <Box mb={4}>
                <UserList 
                    users={userAPI.data?.pagination?.followers}
                    snackbar={snackbar}
                    followingAPI={followingAPI}
                    userAPI={userAPI}
                    onUserListUpdate={handleFollowerListUpdate}
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