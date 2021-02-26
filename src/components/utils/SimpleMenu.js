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
export default function SimpleMenu({ icon, menuItems }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
        <IconButton onClick={handleClick}>
            {icon}
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
            {menuItems.map((item, i) => (
                <MenuItem key={i} onClick={() => { 
                    handleClose();
                    item.onClick();
                }}>
                    <Typography component="span" variant="button">{item.label}</Typography>
                </MenuItem>
            ))
            }
        </Menu>
    </div>
  );
}