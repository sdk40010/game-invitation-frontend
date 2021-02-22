import { useState } from "react";
import apiCall from "../http/http";

/**
 * 募集に関するAPI用のフック
 */
export default function useInvitationAPI() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    /**
     * クエリーに基づいて募集一覧を取得する
     * @param {URLSearchParams} query - クエリー
     * @returns {Object} json - 募集一覧
     */
    const getAll = async (query) => {
        try {
            const queryString = query.toString() ? `?${query.toString()}` : "";
            const json = await apiCall(`/api/v1/invitations${queryString}`, "GET");
            setData(json);
            return json;
        } catch (err) {
            setError(err);
            return {};
        }
    }

    /**
     * 指定されたIDに対応する募集を取得する
     * @param {number} id - 募集ID
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
     * @param {Object} input - フォームの入力値
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
     * @param {number} id - 募集ID
     * @param {Object} input - フォームの入力値
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

    /**
     * 指定されたIDに対応する募集を削除する
     * @param {number} id - 募集ID
     * @returns {bookean} success - 削除が成功したかどうか
     */
    const remove = async (id) => {
        try {
            await apiCall(`/api/v1/invitations/${id}`, "DELETE");
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
    }

}