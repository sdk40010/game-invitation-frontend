import { useState } from "react";
import apiCall from "../http/http";

export default function useUserAPI(userId) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    /**
     * ユーザーが投稿した募集一覧を取得する
     * 
     * @param {URLSearchParams} query - クエリー
     * @returns {array} ユーザーが投稿した募集一覧
     */
    const getInvitations = async (query) => {
        try {
            const queryString = query.toString() ? `?${query.toString()}` : "";
            const invitations = await apiCall(`/api/v1/users/${userId}${queryString}`, "GET");
            setData(invitations);
            return invitations;
        } catch (err) {
            setError(err);
            return [];
        }
    }

    return {
        data,
        error,
        getInvitations,
    };
}