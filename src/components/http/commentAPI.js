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
     * @param {number} id - 募集ID
     * @returns {Object} comments - コメント一覧
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
     * コメントを取得する
     * 
     * @param {number} invitationId - 募集ID
     * @param {number} commentId - コメントID
     * @returns {Object} comment - コメント
     */
    const get = async (invitationId, commentId) => {
        try {
            const comment = await apiCall(`/api/v1/invitations/${invitationId}/comments/${commentId}`, "GET");
            setData(prevData => [...replaceWith(prevData, comment)]);
            return comment;
        } catch (err) {
            setError(err);
            return {};
        }
    }

    /**
     * 募集にコメントを投稿する
     * 
     * @param {Object} input - コメントフォームの入力値
     * @param {number} id - 募集ID
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
     * @param {number} invitationId - 募集ID
     * @param {number} commentId - コメントID
     * @returns {boolean} success - 更新が成功したかどうか
     */
    const update = async (input, invitationId, commentId) => {
        try {
            const comment = await apiCall(
                `/api/v1/invitations/${invitationId}/comments/${commentId}`,
                "PUT",
                input
            );
            setData(prevData => {
                setData(prevData => [...replaceWith(prevData, comment)]);
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
     * @param {number} invitationId - 募集ID
     * @param {number} commentId - コメントID
     * @returns {boolean} success - 削除が成功したかどうか
     */
    const remove = async (invitationId, commentId) => {
        try {
            await apiCall(`/api/v1/invitations/${invitationId}/comments/${commentId}`, "DELETE");
            setData(prevData => [...removeById(prevData, commentId)]);
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
        get,
        post,
        update,
        remove
    };
}

/**
 * 更新されたコメントとIDが一致するコメント一覧の要素を置き換える
 * 
 * @param {array} comments - コメント一覧
 * @param {Object} updated - 更新されたコメント
 * @returns {array} 置換済みのコメント一覧
 */
export const replaceWith = (comments, updated) => {
    const copied = comments.slice();
    const index = copied.findIndex(comment => comment.id === updated.id);
    copied.splice(index, 1, updated);
    return copied;
}

/**
 * コメント一覧から指定されたIDと一致する要素を削除する
 * 
 * @param {array} comments コメント一覧
 * @param {number} id - コメントID
 * @returns {array} 削除後のコメント一覧
 */
export const removeById = (comments, id) => {
    const copied = comments.slice();
    const index = copied.findIndex(comment => comment.id === id);
    copied.splice(index, 1);
    return copied;
}