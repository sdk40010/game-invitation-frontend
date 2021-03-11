import { useLocation } from "react-router-dom";
import { useMemo } from "react";

/**
 * 現在のURLのクエリパラメータを返すフック
 */
export default function useQuery() {
    const queryString = useLocation().search;
    return useMemo(() => new URLSearchParams(queryString), [queryString]);
}