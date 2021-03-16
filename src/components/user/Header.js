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
        followingAPI,
        userAPI
    } = props;

    const [value, setValue] = useState(initialTab);

    // タブの変更
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // フォロー
    const handleFollow = async () => {
        const success1 = await followingAPI.post(userAPI.data.user.id);
        // ユーザープロフィールを更新するために、ユーザーをを再取得する
        const success2 = await userAPI.get();
        return Boolean(success1 && success2);
    }

    // フォロー取り消し
    const handleUnfollow = async () => {
        const success1 = await followingAPI.remove(userAPI.data.user.id);
        const success2 = await userAPI.get();
        return Boolean(success1 && success2);
    }

    return (
        <Paper square>
            <Box p={2}>
                <UserProfile
                    user={user}
                    iconSize="large"
                    typographyVariant="h5"
                    onFollow={handleFollow}
                    onUnfollow={handleUnfollow}
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