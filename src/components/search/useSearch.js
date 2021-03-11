import { useState, useEffect, useContext, createContext } from "react";

const searchFormContext = createContext();

export function searchFormProvider() {
    const searchForm = useProvideSearchForm({children});
    return <searchFormProvider.context value={searchForm}>{children}</searchFormProvider.context>
}

export function useSearchForm() {
    return useContext(searchFormContext);
}

export function useProvideSearchForm() {
    const [inputs, setInputs] = useState(null);

    const save = (current) => {
        setInputs(current);
    }

    const reset = () => {
        setInputs(null);
    }

    return {
        inputs,
        save,
        reset,
    };
}
