import { useState } from "react";
import apiCall from "../http/http";

/**
 * 募集に関するAPI用のフック
 */
export default function useInvitationAPI() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    /**
     * 募集一覧を取得する
     * 
     * @param {URLSearchParams} query - クエリパラメータ
     * @returns {Object} 募集一覧（ページング用のメタ情報付）
     */
    const getAll = async (query) => {
        try {
            const queryString = query.toString() ? `?${query.toString()}` : "";
            const invitations = await apiCall(`/api/v1/invitations${queryString}`, "GET");
            setData(invitations);
            return invitations;
        } catch (err) {
            setError(err);
            return {};
        }
    }

    /**
     * クエリパラメータに基づいて募集を検索する
     * 
     * @param {URLSearchParams} query - クエリパラメータ
     * @returns {Object} 募集一覧（ページング用のメタ情報付）
     */
    const search = async (query) => {
        try {
            const queryString = query.toString() ? `?${query.toString()}` : "";
            const invitations = await apiCall(`/api/v1/invitations/search${queryString}`, "GET");
            setData(invitations);
            return invitations;
        } catch (err) {
            setError(err);
            return {};
        }
    }

    /**
     * 募集を取得する
     * 
     * @param {number} id - 募集ID
     * @returns {Object} 募集
     */
    const get = async (id) => {
        try {
            const invitation = await apiCall(`/api/v1/invitations/${id}`, "GET");
            setData(invitation);
            return invitation;
        } catch (err) {
            setError(err);
            return {};
        }
    }

    /**
     * 募集を投稿する
     * 
     * @param {Object} input - 募集フォームの入力値
     * @returns {boolean} 投稿が成功したかどうか
     */
    const post = async (input) => {
        try {
            const redirectTo = await apiCall("/api/v1/invitations", "POST", input);
            setData(redirectTo);
            return true;
        } catch (err) {
            setError(err);
            return false;
        }
    }

    /**
     * 募集を更新する
     * 
     * @param {number} id - 募集ID
     * @param {Object} input - フォームの入力値
     * @returns {boolean} 更新が成功したかどうか
     */
    const update = async (id, input) => {
        try {
            await apiCall(`/api/v1/invitations/${id}`, "PUT", input);
            return true;
        } catch (err) {
            setError(err);
            return false;
        }
    }

    /**
     * 募集を削除する
     * 
     * @param {number} id - 募集ID
     * @returns {boolean} 削除が成功したかどうか
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
        search,
        get,
        post,
        update,
        remove
    }

}