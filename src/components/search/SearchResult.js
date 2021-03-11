import { useEffect } from "react";

import useInvitationAPI from "../http/invitationAPI";
import useQuery from "../utils/useQuery";

import MainContainer from "../utils/MainContainer";

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
        <MainContainer errors={errors} resources={resources}>
            {invitationAPI.data?.message}
        </MainContainer>
    )
}