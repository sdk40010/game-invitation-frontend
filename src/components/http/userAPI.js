import { useState } from "react";
import apiCall from "../http/http";

export default function useUserAPI(userId) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    /**
     * ユーザーを取得する
     * 
     * @returns {Object} ユーザー
     */
    const get = async () => {
        try {
            const user = await apiCall(`/api/v1/users/${userId}`, "GET");
            setData(prevData => ({
                ...prevData,
                user
            }));
            return user;
        } catch (err) {
            setError(err);
            return {};
        }
    }

    /**
     * ユーザーの投稿履歴を取得する
     * 
     * @param {URLSearchParams} query - クエリパラメータ
     * @returns {Object} ユーザーの投稿履歴（ページング用のメタ情報付）
     */
    const getAllPosted = async (query) => {
        try {
            const queryString = query.toString() ? `?${query.toString()}` : "";
            const invitations = await apiCall(`/api/v1/users/${userId}/invitations${queryString}`, "GET");
            setData(prevData => ({
                ...prevData,
                pagination: invitations
            }));
            return invitations;
        } catch (err) {
            setError(err);
            return {};
        }
    }

    /**
     * ユーザーの参加履歴を取得する
     * 
     * @param {URLSearchParams} query 
     * @returns {Object} ユーザーの参加履歴（ページング用のメタ情報付）
     */
    const getAllParticipatedIn = async(query) => {
        try {
            const queryString = query.toString() ? `?${query.toString()}` : "";
            const invitations = await apiCall(`/api/v1/users/${userId}/participations${queryString}`, "GET");
            setData(prevData => ({
                ...prevData,
                pagination: invitations
            }));
            return invitations;
        } catch (err) {
            setError(err);
            return {};
        }
    }

    /**
     * ユーザーのフォロー一覧を取得する
     * 
     * @param {URLSearchParams} query - クエリパラメータ
     * @returns {array} フォロー一覧
     */
    const getFollowings = async (query) => {
        try {
            const queryString = query.toString() ? `?${query.toString()}` : "";
            const followings = await apiCall(`/api/v1/users/${userId}/followings${queryString}`, "GET");
            setData(prevData => ({
                ...prevData,
                pagination: followings
            }));
            return followings;
        } catch (err) {
            setError(err);
            return [];
        }
    }

    /**
     * ユーザーのフォロワー一覧を取得する
     * 
     * @param {URLSearchParams} query - クエリパラメータ
     * @returns {array} フォロワー一覧
     */
    const getFollowers = async (query) => {
        try {
            const queryString = query.toString() ? `?${query.toString()}` : "";
            const followers = await apiCall(`/api/v1/users/${userId}/followers${queryString}`, "GET");
            setData(prevData => ({
                ...prevData,
                pagination: followers
            }));
            return followers;
        } catch (err) {
            setError(err);
            return [];
        }
    }

    return {
        data,
        error,
        get,
        getAllPosted,
        getAllParticipatedIn,
        getFollowings,
        getFollowers,
    };
}