import { useState } from "react";

/**
 * 表示・非表示を切り替えるコンポーネント用のフック
 */
export function useOpenState() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return { open, handleOpen, handleClose };
}

// スナックバー用のフック
export function useSnackbar () {
    const [state, setState] = useState({});

    const handleOpen = (message) => {
        setState({ open: true, message });
    }

    const handleClose = () => {
        setState(prevState => ({ open: false, message: prevState.message }));
    }

    return {
        open: state.open,
        message: state.message,
        handleOpen,
        handleClose,
    };
}
