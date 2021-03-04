import { useState } from "react";
import apiCall from "../http/http";

/**
 * 参加に関するAPI用のフック
 */
export default function useParticipationAPI() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    /**
     * 募集に参加する
     * 
     * @param {number} id - 募集ID
     * @returns {boolean} リクエストが成功したかどうか
     */
    const post = async (id) => {
        try {
            await apiCall(`/api/v1/invitations/${id}/participations`, "POST");
            return true;
        } catch (err) {
            setError(err);
            return false;
        }
    }

    return {
        data,
        error,
        post,
    };
}