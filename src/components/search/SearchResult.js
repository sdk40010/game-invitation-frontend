import { useEffect } from "react";

import useInvitationAPI from "../http/invitationAPI";
import useQuery from "../utils/useQuery";

import MainContainer from "../utils/MainContainer";
import { InvitationList, Paginator, NoItemMessage } from "../Top";

import {
    Box,
    Typography,
} from "@material-ui/core";

/**
 * 検索結果ページ
 */
export default function SearchResult() {
    const invitationAPI = useInvitationAPI();

    const errors = [invitationAPI.error];
    const resources = [invitationAPI.data];

    const query = useQuery();

    // 検索結果の取得
    useEffect(() => {
        (async () => {
            invitationAPI.search(query);
        })();
    }, [query]);

    return (
        <MainContainer errors={errors} resources={resources} maxWidth="lg">
            {invitationAPI.data?.invitations.length === 0 ? (
                <NoItemMessage>
                    <Typography variant="h5" component="div" paragraph>
                        一致する検索結果はありませんでした
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        別の検索対象や検索条件をお試しください
                    </Typography>
                </NoItemMessage>
            ) : (
                <>
                    <Box mb={4}>
                        <InvitationList invitations={invitationAPI.data?.invitations} />
                    </Box>

                    <Box>
                        <Paginator meta={invitationAPI.data?.meta} />
                    </Box>
                </>
            )}
        </MainContainer>
    )
}