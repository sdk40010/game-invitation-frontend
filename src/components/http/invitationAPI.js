import { useState } from "react";
import apiCall from "../http/http";

export default function useInvitationAPI() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    /**
     * 指定されたIDに対応する募集を取得する
     * @returns {Object} json - 取得した募集データ
     */
    const get = async (id) => {
        try {
            const json = await apiCall(`/api/v1/invitations/${id}`, "GET");
            setData(json);
            return json;
        } catch (err) {
            setError(err);
            return {};
        }
    }

    /**
     * 募集を投稿する
     * @returns {boolean} success - 投稿が成功したかどうか
     */
    const post = async (input) => {
        try {
            const json = await apiCall("/api/v1/invitations", "POST", input);
            setData(json);
            return true;
        } catch (err) {
            setError(err);
            return false;
        }
    }

    /**
     * 指定されたIDに対応する募集を更新する
     * @returns {boolean} success - 更新が成功したかどうか
     */
    const update = async (id, input) => {
        try {
            await apiCall(
                `/api/v1/invitations/${id}`,
                "PUT",
                input
            );
            return true;
        } catch (err) {
            setError(err);
            return false;
        }
    }

    return {
        data,
        error,
        get,
        post,
        update
    }

}