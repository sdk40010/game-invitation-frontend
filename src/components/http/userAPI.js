import { useState } from "react";
import apiCall from "../http/http";

export default function useUserAPI(userId) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    /**
     * ユーザーの投稿履歴を取得する
     * 
     * @param {URLSearchParams} query - クエリパラメータ
     * @returns {Object} ユーザーの投稿履歴（ページング用のメタ情報付）
     */
    const getPosted = async (query) => {
        try {
            const queryString = query.toString() ? `?${query.toString()}` : "";
            const invitations = await apiCall(`/api/v1/users/${userId}${queryString}`, "GET");
            setData(invitations);
            return invitations;
        } catch (err) {
            setError(err);
            return {};
        }
    }

    /**
     * ユーザーの参加履歴を取得する
     * 
     * @param {*} query 
     * @returns {Object} ユーザーの参加履歴（ページング用のメタ情報付）
     */
    const getParticipated = async (query) => {
        try {
            const queryString = query.toString() ? `?${query.toString()}` : "";
            const invitations = await apiCall(`/api/v1/users/${userId}/participations${queryString}`, "GET");
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
        getPosted,
        getParticipated,
    };
}