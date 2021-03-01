import { useState } from "react";
import apiCall from "../http/http";

export default function useReplyAPI() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    /**
     * コメントの返信一覧を取得する
     * 
     * @param {string} id - コメントID
     * @returns {Object} json - コメントの返信一覧
     */
    const getAll = async (id) => {
        try {
            const json = await apiCall(`/api/v1/comments/${id}/replies`, "GET");
            setData(prevData => {
                // 返信一覧はコメントIDに紐付けて管理する
                if (prevData) {
                    return new Map([ [id, json] , ...prevData.entries() ]);
                } else {
                    return new Map([ [id, json] ]);
                }
                
            }); 
            return json;
        } catch (err) {
            setError(err);
            return {};
        }
    }

    /**
     * 返信を投稿する
     * 
     * @param {string} input  返信フォームの入力値
     * @param {string} id - コメントID
     * @returns {boolean} success - 投稿が成功したかどうか
     */
    const post = async (input, id) => {
        try {
            const json = await apiCall(`/api/v1/comments/${id}/replies`, "POST", input);
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