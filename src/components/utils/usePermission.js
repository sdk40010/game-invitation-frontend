import { useState, useEffect } from "react";

/**
 * ページに閲覧制限をかけるためのフック
 * 
 * @param {function} check - 閲覧権限の有無を判定する関数
 * @param {string} message - 閲覧権限がない場合に表示するメッセージ
 * @param {array} deps - check関数の中で参照している変数（useEffectの無限ループを防止する用）
 * @returns {Object} permissionObj - エラー情報を含むオブジェクト
 */
export default function usePermission(check, message, ...deps) {
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!check()) {
            setError(new Error(message));
        }
    }, [...deps]);

    return { error };
}