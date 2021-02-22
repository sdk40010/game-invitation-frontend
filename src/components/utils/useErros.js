import { useState, useEffect } from "react";

/**
 * ページ内で発生する複数のエラーをまとめるためのフック
 * @param {Error[]} errors - ページ内で発生するエラーの配列
 * @returns {Error} error - errorsの中で実際に発生したエラー
 */
export default function useErrors(...errors) {
    const [error, setError] = useState(null);

    useEffect(() => {
        for (let i = 0; i < errors.length; i++) {
            if (errors[i]) {
                setError(errors[i]);
                break;
            }
        }
    }, [errors]);

    return error;
}