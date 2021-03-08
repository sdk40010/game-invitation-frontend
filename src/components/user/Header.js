import { useState } from "react";
import { Link } from "react-router-dom";

import { UserProfile } from "../invitaion/ShowInvitation";

import {
    Tabs,
    Tab,
    Paper,
    Box,
} from "@material-ui/core";

/**
 * ヘッダー
 */
export default function Header({initialTab, user}) {
    const [value, setValue] = useState(initialTab);

    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

    return (
        <Paper square>
            <Box p={2}>
                <UserProfile user={user} iconSize="large" typographyVariant="h5" />
            </Box>

            <Tabs value={value} onChange={handleChange} textColor="primary" indicatorColor="primary">
                <Tab label="投稿" component={Link} to={`/users/${user.id}`} />
                <Tab label="参加" component={Link} to={`/users/${user.id}/participations`}/>
                <Tab label="フレンド" component={Link} to={`/users/${user.id}/frends`}/>
            </Tabs>
        </Paper>
    )
}