import { useState, useEffect, useCallback } from "react";
import {
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Box
}
from "@material-ui/core";

/**
 * メニュー
 */
export default function SimpleMenu({ icon, menuItems, PaperProps, eventProps }) {
  const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = useCallback((event) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = () => {
        setAnchorEl(null);
    };


    useEffect(() => {
        // 外部のコンポーネントで指定されたイベントが発生したときの処理を登録
        if (eventProps) {
            eventProps.emitter.on(eventProps.name, handleClick);
        }

        // イベントリスナーの解除
        return () => {
            if (eventProps) {
                eventProps.emitter.off(eventProps.name, handleClick);
            }
        }
    })

    return (
        <Box>
            {icon && (
              <IconButton onClick={handleClick}>{icon}</IconButton>
            )}
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={PaperProps}
            >
                {menuItems.map((item, i) => {
                    const handleClick = () => {
                        handleClose();
                        item.onClick();
                    }

                    return (
                        <MenuItem key={i} onClick={handleClick}>
                            {item.disableTypography ? (
                                item.content
                            ) : (
                                <Typography component="span" variant="button">{item.content}</Typography>
                            )}
                        </MenuItem>
                    );
                })}
            </Menu>
        </Box>
    );
}