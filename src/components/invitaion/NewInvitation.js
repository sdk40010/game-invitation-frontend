import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

import { useAuth } from "../auth/useAuth";
import useInvitationAPI from "../http/invitationAPI";
import useTagAPI from "../http/tagAPI";
import useErrors from "../utils/useErros";
import useLoading from "../utils/useLoading";

import MainContainer from "../utils/MainContainer";
import InvitationForm from "./InvitationForm";
import { formatTime } from "./InputField";
import {
    Typography,
    Card,
    CardHeader,
    CardContent,
} from "@material-ui/core";

const defaultValues = {
    title: "",
    description: "",
    startTime: null,
    endTime: null,
    capacity: "",
    tags: []
}

/**
 * 募集投稿ページ
 */
export default function NewInvitation() {
    const auth = useAuth();
    const invitationAPI = useInvitationAPI();
    const tagAPI = useTagAPI();

    const pageError = useErrors(auth.error, invitationAPI.error, tagAPI.error);
    const loading = useLoading(tagAPI.data);

    const [sumbitSuccess, setSubmitSuccess] = useState(false);

    // タグ一覧の取得
    useEffect(() => {
        (async () => {
            await tagAPI.getAll();
        })();
    }, []);

    // 募集を投稿する
    const handleSubmit = async (input) => {
        // 時刻の表示形式を整える
        const { startTime, endTime } = input;
        input.startTime = formatTime(startTime);
        input.endTime = formatTime(endTime);

        const success = await invitationAPI.post(input);
        setSubmitSuccess(success);
    };

    // 描画処理
    if (sumbitSuccess) {
        return <Redirect to={invitationAPI.data.redirectTo} />
    } else {
        return (
            <MainContainer error={pageError} loading={loading} maxWidth="sm">
                <Card>
                    <CardHeader 
                        title={<Typography variant="h6" component='h1'>募集の新規作成</Typography>}
                    />
                    <CardContent>
                        <InvitationForm 
                            onSubmit={handleSubmit}
                            defaultValues={defaultValues}
                            tagOptions={tagAPI.data}
                            buttonLabel="投稿"
                        />
                    </CardContent>
                </Card>
            </MainContainer>
        );
    }
}