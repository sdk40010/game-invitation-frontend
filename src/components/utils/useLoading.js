import { useState, useEffect } from "react";

/**
 * 複数のAPIリソースの読み込み状況をまとめるためのフック
 * @param  {array} resources 
 */
export default function useLoading(resources) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(resources.some(resource => {
            return ! Boolean(resource);
        }));
    }, [resources]);

    return loading;
}