import { useState } from "react";
import apiCall from "../http/http";

/**
 * タグマップ（募集とタグの中間テーブル）に関するAPI用のフック
 */
export default function useTagmapAPI() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    /**
     * 指定されたIDに対応する募集につけられたタグ一覧を取得する
     * 
     * @params {stirng} id - 募集ID
     * @returns {Object} json - タグ一覧
     */
    const getTags = async (id) => {
        try {
            const json = await apiCall(`/api/v1/invitations/${id}/tags`, "GET");
            setData(json);
            return json;
        } catch (err) {
            setError(err);
        }
    }

    return {
        data,
        error,
        getTags,
    }
}