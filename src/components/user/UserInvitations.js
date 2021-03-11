
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import useUserAPI from "../http/userAPI";
import useQuery from "../utils/useQuery";
import useScrollToTop from "../utils/useScrollToTop";
import { useSnackbar } from "../utils/useOpenState";

import MainContainer from "../utils/MainContainer";
import { InvitationList, Paginator } from "../Top";
import Header from "./Header";

import { Box } from "@material-ui/core";

export default function UserInvitations() {
    const { id } = useParams(); // ユーザーID

    const userAPI = useUserAPI(id);

    const errors = [userAPI.error];
    const resources = [userAPI.data];

    const query = useQuery();

    useScrollToTop();

    // ユーザーの投稿履歴を取得する
    useEffect(() => {
        (async () => {
            await userAPI.getPosted(query);
        })();
    }, [query]);

    return (
        <MainContainer errors={errors} resources={resources} maxWidth="lg">
            <Box mb={2}>
                <Header initialTab={0} user={userAPI.data} />
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

