import React, { useState, useEffect, useContext, createContext } from "react";
import firebase from "firebase/app";
import "firebase/auth";


firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
});

const authContext = createContext();

export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
    return useContext(authContext);
}

function useProvideAuth() {
    const [user, setUser] = useState(null);

    const login = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await firebase.auth().signInWithPopup(provider);
        const res = await sendIdToken(result.user);
        if (res.ok) {
            setUser(result.user);
        } else {
            await firebase.auth().signOut();
        }
    }

    const logout = async () => {
        await firebase.auth().signOut();
        await apiCall("/api/v1/logout", "POST");
        setUser(false);
    }

    const sendIdToken = async (user) => {
        const idToken = await user.getIdToken();
        return await apiCall("/api/v1/login", "POST", { idToken });
    }

    const apiCall = async (path, method, data = {}) => {
        const apiServerRoot = process.env.REACT_APP_API_SERVER_ROOT;
        const xsrfToken = user ?
            document.cookie.split("; ").find(row => row.startsWith("XSRF-TOKEN"))?.split("=")[1] : 
            ""
        const res = await fetch(apiServerRoot + path, { 
            method: method,
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
            },
            body: JSON.stringify(data)
        }).catch(e => {
            console.log("Error: " + e);
        });
        return res;
    }


    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            console.log("unsubscribe");
            if (user) {
                setUser(user);
            } else {
                setUser(false);
            }
        });

        return () => unsubscribe();
    });

    return {
        user,
        login,
        logout,
        apiCall
    };
}


