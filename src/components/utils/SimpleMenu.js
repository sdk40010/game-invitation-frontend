import { useState, useEffect, forwardRef } from "react";

import SimpleLink from "./SimpleLink";

import {
    IconButton,
    Menu,
    MenuItem,
    Typography,
} from "@material-ui/core";

/**
 * メニュー
 */
export default function SimpleMenu(props) {
    const {
        icon,
        enableStopPropagation = false,
        menuItems,
        IconButtonProps,
        PaperProps,
        addEventListener = () => {},
        removeEventListener = () => {},
    } = props;

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        if (enableStopPropagation) {
            event.stopPropagation();
        }
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event) => {
        if (enableStopPropagation) {
            event.stopPropagation();
        }
        setAnchorEl(null);
    };

    useEffect(() => {
        // 外部のコンポーネントでメニューを開くきっかけとなるイベントが発生したときの処理を登録
        addEventListener(handleClick);
        return () => {
            removeEventListener(handleClick);
        }
    }, []);

    return (
        <>
            {icon && (
                <IconButton onClick={handleClick} component="span" {...IconButtonProps}>
                    {icon}
                </IconButton>
            )}
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={PaperProps}
            >
                {menuItems.map((item, i) => {
                    const handleItemClick = (event) => {
                        handleClose(event);
                        if (item.onClick) {
                            item.onClick(event);
                        }
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
        </>
    );
}

/**
 * メニューアイテム
 */
const SimpleMenuItem = forwardRef((props, ref) => {
    const {item, ...rest} = props;

    const component = item.link ? SimpleLink : "li";
    const menuItem = (
        <MenuItem {...rest} ref={ref} component={component} to={item.link}>
            {item.disableTypography
                ? item.content
                : <Typography component="span" variant="button">{item.content}</Typography>
            }
        </MenuItem>
    );

    return item.link 
        ? <li>{menuItem}</li> 
        : menuItem;
});
