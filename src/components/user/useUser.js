import { useState, useEffect, useContext, createContext } from "react";
import { useLocation } from "react-router-dom";

import useUserAPI from "../http/userAPI";

const userContext = createContext();

/**
 * ユーザーAPIオブジェクトを提供するコンテキストプロバイダー
 */
export function UserProvider({children}) {
    const userAPI = useUserAPI();

    return (
        <userContext.Provider value={userAPI}>{children}</userContext.Provider>
    );
}

/**
 * ユーザーAPIオブジェクトを利用するためのフック
 */
export function useUser() {
    return useContext(userContext);
}