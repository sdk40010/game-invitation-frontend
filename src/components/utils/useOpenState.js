import { useState } from "react";

/**
 * 表示・非表示を切り替えるコンポーネント用のフック
 */
export default function useOpenState() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return { open, handleOpen, handleClose };
}