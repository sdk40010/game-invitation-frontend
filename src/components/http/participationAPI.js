import { useState } from "react";
import apiCall from "../http/http";

/**
 * 参加に関するAPI用のフック
 */
export default function useParticipationAPI() {
    const [error, setError] = useState(null);

    /**
     * 募集に参加する
     * 
     * @param {number} id - 募集ID
     * @returns {boolean} 参加の保存が成功したかどうか
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

    /**
     * 募集への参加を取り消す
     * 
     * @param {number} id - 募集ID
     * @returns {boolean} 参加の取り消しが成功したかどうか
     */
    const remove = async (id) => {
        try {
            await apiCall(`/api/v1/invitations/${id}/participations`, "DELETE");
            return true;
        } catch (err) {
            setError(err);
            return false;
        }
    }

    return {
        error,
        post,
        remove,
    };
}