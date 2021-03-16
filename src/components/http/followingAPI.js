import { useState } from "react";
import apiCall from "./http";

export default function useFollowingAPI() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    /**
     * ユーザーをフォローする
     * 
     * @param {number} id フォローするユーザーのID
     * @returns {boolean} フォローが成功したかどうか
     */
    const post = async (id) => {
        try {
            await apiCall(`/api/v1/users/${id}/followings`, "POST");
            return true;
        } catch (err) {
            setError(err);
            return false;
        }
    }

    /**
     * ユーザーのフォローを取り消す
     * 
     * @param {number} id - フォローを取り消すユーザーのID
     * @returns {boolean} フォローの取り消しが成功したかどうか
     */
    const remove = async (id) => {
        try {
            await apiCall(`/api/v1/users/${id}/followings`, "DELETE");
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
        remove,
    };
}