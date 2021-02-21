import { useLocation } from "react-router-dom";

/**
 * 現在のURLのクエリーパラメータを返すフック
 */
export default function useQuery() {
    return new URLSearchParams(useLocation().search);
}