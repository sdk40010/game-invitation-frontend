import { useState } from "react";
import apiCall from "../http/http";

/**
 * コメントに関するAPI用のフック
 */
export default function useCommentAPI() {
    const [data, setData] = useState(null);
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
     * @param {string} id - 募集ID
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
    
    /**
     * 募集へのコメントを更新する
     * 
     * @param {Object} input - コメントフォームの入力値
     * @param {string} invitationId - 募集ID
     * @param {string} commentId - コメントID
     * @returns {boolean} success - 更新が成功したかどうか
     */
    const update = async (input, invitationId, commentId) => {
        try {
            const json = await apiCall(
                `/api/v1/invitations/${invitationId}/comments/${commentId}`,
                "PUT",
                input
            );
            setData(prevData => {
                const index = prevData.findIndex(comment => comment.id === json.id);
                prevData.splice(index, 1, json);
                return [...prevData];
            });
            return true;
        } catch (err) {
            setError(err);
            return false;
        }
    }

    /**
     * コメントを削除する
     * 
     * @param {string} invitationId - 募集ID
     * @param {string} commentId - コメントID
     * @returns {boolean} success - 削除が成功したかどうか
     */
    const remove = async (invitationId, commentId) => {
        try {
            await apiCall(`/api/v1/invitations/${invitationId}/comments/${commentId}`, "DELETE");
            setData(prevData => {
                const index = prevData.findIndex(comment => comment.id === commentId);
                prevData.splice(index, 1);
                return [...prevData];
            });
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
        update,
        remove
    };
}