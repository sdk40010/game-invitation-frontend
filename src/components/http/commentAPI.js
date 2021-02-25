import { useState } from "react";
import apiCall from "../http/http";

/**
 * コメントに関するAPI用のフック
 */
export default function useCommentAPI() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    /**
     * 募集のコメント一覧を取得する
     * 
     * @param {string} id - 募集ID
     * @returns {Object} json - コメント一覧
     */
    const getAll = async (id) => {
        try {
            const json = await apiCall(`/api/v1/invitations/${id}/comments`, "GET");
            setData(json);
            return json;
        } catch (err) {
            setError(err);
            return {};
        }
    }

    /**
     * 募集にコメントを投稿する
     * 
     * @param {Object} input - コメントフォームの入力値
     * @param {*} id - 募集ID
     * @returns {boolean} success - 投稿が成功したかどうか
     */
    const post = async (input, id) => {
        try {
            const json = await apiCall(`/api/v1/invitations/${id}/comments`, "POST", input);
            setData(prevData => [json, ...prevData]);
            return true;
        } catch (err) {
            setError(err);
            return false;
        }
    }

    return {
        data,
        error,
        getAll,
        post,
    };
}