import { useState, useEffect, forwardRef } from "react";

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
export default function SimpleMenu(props) {
    const { icon, iconSize, enableStopPropagation, menuItems, PaperProps, eventProps } = props;

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
        <>
            {icon && (
                <IconButton onClick={handleClick} size={iconSize ?? "medium"} component="span">
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
