import { useEffect } from "react";
import { useParams } from "react-router-dom";

import useUserAPI from "../http/userAPI";
import useFollowingAPI from "../http/followingAPI";
import useQuery from "../utils/useQuery";
import useScrollToTop from "../utils/useScrollToTop";

import MainContainer from "../utils/MainContainer";
import { InvitationList, Paginator } from "../Top";
import Header from "./Header";

import { Box } from "@material-ui/core";

export default function UserInvitations() {
    const { id } = useParams(); // ユーザーID

    const userAPI = useUserAPI(id);
    const followingAPI = useFollowingAPI();

    const errors = [userAPI.error, followingAPI.error];
    const resources = [userAPI.data];

    const query = useQuery();

    useScrollToTop();

    // ユーザーの投稿履歴を取得する
    useEffect(() => {
        (async () => {
            await userAPI.getPosted(query);
        })();
    }, [query]);

    // フォロー
    const handleFollow = async () => {
        const success1 = await followingAPI.post(userAPI.data.id);
        // ユーザープロフィールを更新するために、募集をを再取得する
        const success2 = await userAPI.getPosted(query);
        return Boolean(success1 && success2);
    }

    // フォロー取り消し
    const handleUnFollow = async () => {
        const success1 = await followingAPI.remove(userAPI.data.id);
        const success2 = await userAPI.getPosted(query);
        return Boolean(success1 && success2);
    }

    return (
        <MainContainer errors={errors} resources={resources} maxWidth="lg">
            <Box mb={2}>
                <Header
                    user={userAPI.data}
                    onFollow={handleFollow}
                    onUnFollow={handleUnFollow}
                />
            </Box>
            
            <Box>
                <InvitationList invitations={userAPI.data?.posted.invitations} />
            </Box>
            
            <Box mt={4}>
                <Paginator meta={userAPI.data?.posted.meta} />
            </Box>
        </MainContainer>
    )
}

