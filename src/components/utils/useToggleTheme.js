import { useState } from "react";

import { createMuiTheme } from "@material-ui/core/styles";

/**
 * テーマーを変更するためのフック
 */
export default function useToggleTheme() {
    const [mode, setMode] = useState(() => {
        const stored = window.localStorage.getItem("mode");
        // デバイスでダークモードを使用しているか
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)')?.matches;

        const initialMode
            = stored ? stored
            : prefersDarkMode ? "dark"
            : "light";

        return initialMode;
    });
    
    const handleToggleTheme = () => {
        const next = mode === "light" ? "dark" : "light";
        setMode(next);
        window.localStorage.setItem("mode", next);
    }

    const theme = createMuiTheme({
        palette: {
            type: mode
        },
    });

    return {
        theme,
        handleToggleTheme
    };
}