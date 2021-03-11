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

export default function UserParticipations() {
    const { id } = useParams(); // ユーザーID

    const userAPI = useUserAPI(id);

    const errors = [userAPI.error];
    const resources = [userAPI.data];

    const query = useQuery();

    useScrollToTop();

    // ユーザーの参加履歴を取得する
    useEffect(() => {
        (async () => {
            userAPI.getParticipated(query);
        })();
    }, [query]);

    return (
        <MainContainer errors={errors} resources={resources} maxWidth="lg">
            <Box mb={2}>
                <Header initialTab={1} user={userAPI.data} />
            </Box>
            
            <Box>
                <InvitationList invitations={userAPI.data?.participatedIn.invitations} />
            </Box>
            
            <Box mt={4}>
                <Paginator meta={userAPI.data?.participatedIn.meta} />
            </Box>
        </MainContainer>
    );

}