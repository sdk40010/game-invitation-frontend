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

    const login = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        return firebase
            .auth()
            .signInWithPopup(provider)
            .then(result => {
                return sendIdToken(result.user);
            })
            .then(({ res, user }) => {
                setUser(user);
            });
    }

    const logout = () => {
        return firebase
            .auth()
            .signOut()
            .then(() => {
                setUser(false);
            });
    }

    async function sendIdToken(user) {
        const idToken = await user.getIdToken();
        const res = await apiCall("/api/v1/auth", "POST", { idToken });
        return { res, user };
    }

    const apiCall = async (path, method, data = {}) => {
        const apiServerRoot = process.env.REACT_APP_API_SERVER_ROOT;
        const res = await fetch(apiServerRoot + path, { 
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        return res.json();
    }


    useEffect(() => {
        console.log('unsubscribe');
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
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


