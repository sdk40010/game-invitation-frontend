import { useState, useEffect, useMemo, forwardRef } from "react";
import { Link } from 'react-router-dom';

import SimpleLink from "./SimpleLink";

import {
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Box
} from "@material-ui/core";

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


    useEffect(() => {
        // 外部のコンポーネントで指定されたイベントが発生したときの処理を登録
        if (eventProps) {
            eventProps.emitter.on(eventProps.name, handleClick);
        }

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
                    const handleItemClick = () => {
                        handleClose();
                        item.onClick();
                    }

                    return (
                        <SimpleMenuItem 
                            item={item} 
                            onClick={handleItemClick} 
                            key={i}
                        />
                    );
                })}
            </Menu>
        </Box>
    );
}

/**
 * メニューアイテム
 */
const SimpleMenuItem = forwardRef((props, ref) => {
    const {item, onClick } = props;
    
    const menuItem = (
        <MenuItem onClick={onClick} ref={ref} component="div">
            {item.disableTypography
                ? item.content
                : <Typography component="span" variant="button">{item.content}</Typography>
            }
        </MenuItem>
    );

    return (
        <li>
            {item.link 
                ? <SimpleLink to={item.link}>{menuItem}</SimpleLink>
                : menuItem
            }
        </li>
    );
});
