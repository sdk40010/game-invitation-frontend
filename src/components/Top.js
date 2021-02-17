import React from "react";
import { useAuth } from "./auth/use-auth";
import MainContainer from "./utils/MainContainer";

export default function Top() {
    const auth = useAuth();

    return(
        <MainContainer error={auth.error} maxWidth="lg">
            <div>Top</div>
        </MainContainer>
    );
}