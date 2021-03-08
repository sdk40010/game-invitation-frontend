import { useState } from "react";

import { UserProfile } from "../invitaion/ShowInvitation";
import SimpleLink from "../utils/SimpleLink";

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
                <Tab label="投稿" component={SimpleLink} to={`/users/${user.id}`} />
                <Tab label="参加" component={SimpleLink} to={`/users/${user.id}/participations`}/>
                <Tab label="フレンド" component={SimpleLink} to={`/users/${user.id}/frends`}/>
            </Tabs>
        </Paper>
    )
}