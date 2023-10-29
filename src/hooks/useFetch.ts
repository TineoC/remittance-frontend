import { useCallback, useEffect, useState } from "react";
import { HTTPResponse } from "../utils";

interface Props {
    functionToExecute: () => Promise<HTTPResponse>;
    runOnStarted?: boolean;
}

export const useFetch = <DataResponse>({functionToExecute, runOnStarted = true}: Props) => {
    const [loading, setLoading] = useState(false);
    const [successResponse, setSuccessResponse] = useState(false);
    const [message, setMessage] = useState<string | undefined>();
    const [data, setData] = useState<DataResponse | undefined>();

    const fetchFunc = useCallback(async ()  => {
        setLoading(true);
        try {
            const response = await functionToExecute();
            
            console.log({response});
            if (response.result === "Ok") {
                setData(response.data);
                setSuccessResponse(true);
            } else {
                setSuccessResponse(false);
                setMessage(response.data?.Message || response.message);
            }
        } catch (error) {
            console.error({error});
            setSuccessResponse(false);
            
            if (typeof error === "string") {
                setMessage(error);
            } else if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage("Unhandled error.");
            }
        } finally {
            setLoading(false);
        }
    }, [setLoading, setData, setSuccessResponse, setMessage]);

    useEffect(() => {
        if(runOnStarted){
            fetchFunc();
        }
    },[])

    return {
        loading,
        success: successResponse,
        errorMessage: message,
        setErrorMessage: setMessage,
        data,
        execRequest: fetchFunc,
    }
} ;