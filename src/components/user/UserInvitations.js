import { useEffect } from "react";
import { useParams } from "react-router-dom";

import useUserAPI from "../http/userAPI";
import useFollowingAPI from "../http/followingAPI";
import useQuery from "../utils/useQuery";
import useScrollToTop from "../utils/useScrollToTop";
import { useSnackbar } from "../utils/useOpenState";

import MainContainer from "../utils/MainContainer";
import { InvitationList, Paginator } from "../Top";
import Header from "./Header";

import {
    Box,
    Snackbar,
} from "@material-ui/core";

export default function UserInvitations() {
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
        userAPI.get();
    }, [id]);

    // ユーザーの投稿履歴を取得する
    useEffect(() => {
        (async () => {
            await userAPI.getAllPosted(query);
        })();
    }, [id, query]);

    return (
        <MainContainer errors={errors} resources={resources} maxWidth="lg">
            <Box mb={2}>
                <Header
                    user={userAPI.data?.user}
                    snackbar={snackbar}
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

            <Snackbar 
                anchorOrigin={{ vertical: "bottom", horizontal: "left"}}
                open={snackbar.open}
                message={snackbar.message}
                autoHideDuration={3000}
                onClose={snackbar.handleClose}
            />
        </MainContainer>
    )
}

