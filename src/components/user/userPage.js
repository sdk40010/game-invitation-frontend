import { useEffect } from "react";
import { useParams } from "react-router-dom";

import useUserAPI from "../http/userAPI";
import useFollowingAPI from "../http/followingAPI";
import useQuery from "../utils/useQuery";
import useScrollToTop from "../utils/useScrollToTop";

import MainContainer from "../utils/MainContainer";
import { Paginator } from "../Top";
import Header from "./Header";

import {
    Box,
} from "@material-ui/core";

export default function UserFollowings() {
    // ユーザーIDと表示するコンテンツの名前
    const { id, contentName } = useParams();

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

    // 表示するコンテンツを取得する
    useEffect(() => {
        (async () => {
            if (contentName === "invitations") {
                await userAPI.getAllPosted();

            } else if (contentName === "participations") {
                userAPI.getAllParticipatedIn(query);

            } else if (contentName === "followings") {
                userAPI.getFollowings(query);

            } else if (contentName === "followers") {
                userAPI.getFollowers(query);

            }
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
                
            </Box>

            <Box>
                <Paginator meta={userAPI.data?.pagination?.meta} />
            </Box>
        </MainContainer>
    );
}