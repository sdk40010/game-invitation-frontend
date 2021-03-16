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

export default function UserParticipations() {
    const { id } = useParams(); // ユーザーID

    const userAPI = useUserAPI(id);
    const followingAPI = useFollowingAPI();

    const errors = [userAPI.error, followingAPI.error];
    const resources = [userAPI.data?.user, userAPI.data?.pagination];

    const query = useQuery();

    useScrollToTop();

    // ユーザーを取得する
    useEffect(() => {
        userAPI.get();
    }, []);
    
    // ユーザーの参加履歴を取得する
    useEffect(() => {
        (async () => {
            userAPI.getAllParticipatedIn(query);
        })();
    }, [query]);

    return (
        <MainContainer errors={errors} resources={resources} maxWidth="lg">
            <Box mb={2}>
                <Header
                    initialTab={1}
                    user={userAPI.data?.user}
                    followingAPI={followingAPI}
                    userAPI={userAPI}
                />
            </Box>
            
            <Box mb={4}>
                <InvitationList invitations={userAPI.data?.pagination?.invitations} />
            </Box>
            
            <Box>
                <Paginator meta={userAPI.data?.pagination?.meta} />
            </Box>
        </MainContainer>
    );

}