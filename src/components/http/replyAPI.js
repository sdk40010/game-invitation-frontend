import { useState } from "react";
import apiCall from "../http/http";
import { replaceWith, removeById } from "./commentAPI";

export default function useReplyAPI() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    /**
     * コメントの返信一覧を取得する
     * 
     * @param {string} id - コメントID
     * @returns {array} コメントの返信一覧
     */
    const getAll = async (id) => {
        try {
            const replies = await apiCall(`/api/v1/comments/${id}/replies`, "GET");
            setData(prevData => {
                // 返信一覧はコメントIDに紐付けて管理する
                if (prevData) {
                    return new Map([...prevData.set(id, replies).entries()]);
                } else {
                    return new Map([ [id, replies] ]);
                }
            }); 
            return replies;
        } catch (err) {
            setError(err);
            return [];
        }
    }

    /**
     * 返信を投稿する
     * 
     * @param {string} input  返信フォームの入力値
     * @param {string} id - コメントID
     * @returns {boolean} 投稿が成功したかどうか
     */
    const post = async (input, id) => {
        try {
            const replies = await apiCall(`/api/v1/comments/${id}/replies`, "POST", input);
            setData(prevData => {
                if (prevData) {
                    return new Map([...prevData.set(id, replies).entries()]);
                } else {
                    return new Map([ [id, replies] ]);
                }
            });
            return true;
        } catch (err) {
            setError(err);
            return false;
        }
    }

    /**
     * 返信を更新する
     * 
     * @param {Object} input - 返信フォームの入力値
     * @param {string} commentId - コメントID
     * @param {string} replyId - 返信ID
     * @returns {boolean} 更新が成功したがどうか
     */
    const update = async (input, commentId, replyId) => {
        try {
            const reply = await apiCall(`/api/v1/comments/${commentId}/replies/${replyId}`, "PUT", input);
            setData(prevData => {
                prevData.set(commentId, replaceWith(prevData.get(commentId), reply));
                return new Map([...prevData.entries()]);
            });
            return true;
        } catch (err) {
            setError(err);
            return false;
        }
    }

    /**
     * 返信を削除する
     * 
     * @param {number} commentId - コメントID
     * @param {number} replyId - 返信ID
     * @returns {boolean} - 削除が成功したがどうか
     */
    const remove = async (commentId, replyId) => {
        try {
            await apiCall(`/api/v1/comments/${commentId}/replies/${replyId}`, "DELETE");
            setData(prevData => {
                prevData.set(commentId, removeById(prevData.get(commentId), replyId));
                return new Map([...prevData.entries()]);
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