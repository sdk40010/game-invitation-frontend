import { useState } from "react";
import apiCall from "../http/http";

export default function useTagAPI() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    /**
     * タグ一覧を取得する
     * 
     * @returns {array} タグ一覧
     */
    const getAll = async () => {
        try {
            const tags = await apiCall("/api/v1/tags", "GET");
            setData(tags);
            return tags;
        } catch (err) {
            setError(err);
        }
    }

    return {
        data,
        error,
        getAll,
    };
}