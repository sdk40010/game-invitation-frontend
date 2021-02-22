import { useState } from "react";
import apiCall from "../http/http";

export default function useTagAPI() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    /**
     * タグ一覧を取得する
     * @returns {Object} json - タグ一覧
     */
    const getAll = async () => {
        try {
            const json = await apiCall("/api/v1/tags", "GET");
            setData(json);
            return json;
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