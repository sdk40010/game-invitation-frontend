import { useState } from "react"

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
export default function Header(props) {
    const {
        initialTab = 0,
        user,
        onFollow,
        onUnFollow
    } = props;

    const [value, setValue] = useState(initialTab);

    // タブの変更
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

    return (
        <Paper square>
            <Box p={2}>
                <UserProfile
                    user={user}
                    iconSize="large"
                    typographyVariant="h5"
                    onFollow={onFollow}
                    onUnFollow={onUnFollow}
                />
            </Box>

            <Tabs value={value} onChange={handleChange} textColor="primary" indicatorColor="primary">
                <Tab label="投稿" component={SimpleLink} to={`/users/${user.id}`} />
                <Tab label="参加" component={SimpleLink} to={`/users/${user.id}/participations`}/>
                <Tab label="フォロー" component={SimpleLink} to={`/users/${user.id}/followings`}/>
                <Tab label="フォロワー" component={SimpleLink} to={`/users/${user.id}/followers`}/>
            </Tabs>
        </Paper>
    )
}