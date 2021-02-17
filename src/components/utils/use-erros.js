import React, { useState, useEffect } from "react";

/**
 * ページ内で発生する複数のエラーをまとめるためのフック
 * MainConteinerコンポーネントにerrorプロパティを渡すために使用する
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
    }, errors);

    return error;
}