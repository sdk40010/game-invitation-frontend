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
        palette: getPallet(mode)
    });

    return {
        theme,
        handleToggleTheme
    };
}

const getPallet = (mode) => {
    switch (mode) {
        case "light":
            return lightThemePalette;
        case "dark":
            return darkThemePalette;
        default:
            return;
    }
}

const lightThemePalette = {
    type: "light",
    error: {
        main: "#e53935" // red 600
    },
    link: {
        main: "#065fd4" // YouTubeライトテーマのリンク色
    }
};

const darkThemePalette = {
    type: "dark",
    primary: {
        main: "#8c9eff" // indigo A100
    },
    secondary: {
        main: "#f48fb1" // pink 200
    }, 
    error: {
        main: "#e57373" // red 300
    },
    link: {
        main: "#3ea6ff"　// YouTubeダークテーマのリンク色
    }
}