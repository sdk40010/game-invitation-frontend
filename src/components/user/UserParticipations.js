import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../auth/useAuth";
import useUserAPI from "../http/userAPI";
import useErrors from "../utils/useErros";
import useLoading from "../utils/useLoading";
import useQuery from "../utils/useQuery";
import useScrollToTop from "../utils/useScrollToTop";
import { useSnackbar } from "../utils/useOpenState";

import MainContainer from "../utils/MainContainer";
import { InvitationList, Paginator } from "../Top";
import Header from "./Header";

import { Box } from "@material-ui/core";

export default function UserParticipations() {
    const { id } = useParams(); // ユーザーID

    const auth = useAuth();
    const userAPI = useUserAPI(id);

    const pageError = useErrors(userAPI.error, auth.error);
    const loading = useLoading(userAPI.data);

    const query = useQuery();

    useScrollToTop();

    // ユーザーが参加した募集一覧を取得する
    useEffect(() => {
        (async () => {
            
        })();
    }, []);

    return (
        <MainContainer error={pageError} loading={loading}>
            <Box mb={2}>
                <Header initialTab={0} user={userAPI.data} />
            </Box>
            
            <Box>
                <InvitationList invitations={userAPI.data?.invitationsParticipated.invitations} />
            </Box>
            
            <Box mt={4}>
                <Paginator meta={userAPI.data?.invitationsParticipated.meta} />
            </Box>
        </MainContainer>
    );

}