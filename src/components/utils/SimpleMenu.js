import React, { useState } from "react";
import {
    IconButton,
    Menu,
    MenuItem,
    Typography,
}
from "@material-ui/core";

/**
 * メニュー
 */
export default function SimpleMenu({ icon, menuItems, PaperProps, eventProps }) {
  const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    if (eventProps) {
        eventProps.emitter.on(eventProps.name, handleClick);
    }

    return (
        <div>
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
        </div>
    );
}