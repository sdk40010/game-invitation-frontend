import React, { useState, useEffect, useContext, createContext } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import apiCall from "../http/http";
import { useLocation } from "react-router-dom";

/**
 * firebaseの初期化
 */
firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
});

const authContext = createContext();

/**
 * useAuthを呼び出したコンポーネント内で認証オブジェクト（useProvideAuthの戻り値）を
 * 利用できるようにするコンテキストプロバイダー
 */
export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

/**
 * 認証オブジェクトを利用するためのフック
 */
export const useAuth = () => {
    return useContext(authContext);
}

/**
 * 認証オブジェクトを返す
 */
function useProvideAuth() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const location = useLocation();

    /**
     * Googleアカウントでログインする
     * ログイン後、APIサーバーにIDトークンを送り、APIサーバーからも認証を受ける
     */
    const login = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            const result = await firebase.auth().signInWithPopup(provider);
            await sendIdToken(result.user);
            setUser(result.user);
            setError(false);
        } catch (err) {
            await firebase.auth().signOut();
            setError(err);
        }
    }

    /**
     * APIサーバーにユーザーのIDトークンを送る
     */
    const sendIdToken = async (user) => {
        const idToken = await user.getIdToken();
        await apiCall("/api/v1/login", "POST", { idToken });
    }

    /**
     * GoogleとAPIサーバーからログアウトする
     */
    const logout = async () => {
        await firebase.auth().signOut();
        try {
            await apiCall("/api/v1/logout", "POST");
            setUser(false);
        } catch (err) {
            setError(err);
        }
    }

    useEffect(() => {
        // unsubscribeはonAuthStateChangedに渡されたイベントリスナーを削除するための関数
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            // !errorではなく、(error === false)としているのは、
            // APIサーバーから認証を受ける前（errorがnull（初期値）のとき）に
            // setUserが実行されるのを防ぐため
            const canSetUser = (error === false);
            if (user && canSetUser) {
                setUser(user);
            } else {
                setUser(false);
            }
        });

        return () => unsubscribe();
    });

    // useEffect(() => {
    //     const loginCheck = async () => {
    //         try {
    //             const json = await apiCall("/api/v1/login/check", "GET");
    //             if (!json.isLoggedIn) {
    //                 logout();
    //             }
    //         } catch (err) {
    //             setError(err);
    //         }
    //     }
    //     loginCheck();
    // }, []);

    // 認証に関するエラーが他のページに影響を与えないように、ページ遷移するたびにエラーを消去する
    useEffect(() => {
        setError(false);
    }, [location]);

    return {
        user,
        error,
        login,
        logout
    };
}


