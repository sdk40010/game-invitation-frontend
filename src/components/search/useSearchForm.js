import { useState, useEffect, useContext, createContext } from "react";
import { useLocation } from "react-router-dom";

import useTagAPI from "../http/tagAPI";

const searchFormContext = createContext();

/**
 * 検索フォームオブジェクトを提供するコンテキストプロバイダー
 */
export function SearchFormProvider({children}) {
    const searchForm = useSearchFormProvider();
    
    return (
        <searchFormContext.Provider value={searchForm}>{children}</searchFormContext.Provider>
    )
}

/**
 * 検索フォームオブジェクトを利用するためのフック
 */
export function useSearchForm() {
    return useContext(searchFormContext);
}

/**
 * コンテキストプロバイダーに検索フォームオブジェクトを渡すためのフック
 */
function useSearchFormProvider() {
    const [inputs, setInputs] = useState(null);

    const tagAPI = useTagAPI();

    const location = useLocation();

    /**
     * 検索フォームの現在の入力値を保存する
     */
    const save = (current) => {
        setInputs(current);
    }

    /**
     * 保存した入力値を初期値に戻す
     */
    const reset = () => {
        setInputs(null);
    }

    // タグ一覧の取得
    useEffect(() => {
        (async () => {
            await tagAPI.getAll()
        })();
    }, []);

    // 検索フォームエラーが他のページに影響を与えないように、ページ遷移するたびにエラーを消去する
    useEffect(() => {
        if (tagAPI.error) {
            tagAPI.resetError();
        }
    }, [location]);

    return {
        inputs,
        tags: tagAPI.data,
        error: tagAPI.error,
        save,
        reset
    };
}