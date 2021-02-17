import React, { useState } from "react";
import apiCall from "../http/http";

export default function useInvitationAPI() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    /**
     * 指定されたIDに対応する募集を取得する
     */
    const get = async (id) => {
        try {
            const json = await apiCall(`/api/v1/invitations/${id}`, "GET");
            setData(json);
        } catch (err) {
            setError(err);
        }
    }

    /**
     * 指定されたIDに対応する募集を更新する
     * @returns {boolean} success - 更新が成功したかどうか
     */
    const update = async (userId, invitationId, input) => {
        try {
            const json = await apiCall(
                `/api/v1/users/${userId}invitations/${invitationId}`,
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
        get
    }

}