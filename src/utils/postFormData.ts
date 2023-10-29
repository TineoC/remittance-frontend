import { ENDPOINT_URL_UNDEFINED, UNHANDLED_ERROR } from "./consts";
import { HTTPResponse } from "./types";

interface properties {
  method?: "GET" | "POST" | "PUT" | "DELETE";
}

export const postFormData = async (
  serviceName: string,
  body: FormData,
  props: properties = {}
): Promise<HTTPResponse> => {
  try {
    const REACT_APP_ENDPOINT_URL = process.env.REACT_APP_ENDPOINT_URL;

    if (!REACT_APP_ENDPOINT_URL) {
      return {
        result: "Error",
        message: ENDPOINT_URL_UNDEFINED,
      } as HTTPResponse;
    }

    const response = await fetch(`${REACT_APP_ENDPOINT_URL}${serviceName}`, {
      method: props?.method || "POST",
      body: body,
    });
    console.log({ response2: response });

    const data = await response.json();
    console.log({
      data,
    });
    if (response.ok) {
      return {
        result: "Ok",
        data,
      } as HTTPResponse;
    } else {
      return {
        result: "Error",
        message: `${response.status} - ${data.Message}`,
      } as HTTPResponse;
    }
  } catch (error) {
    let errorMessage = UNHANDLED_ERROR;

    if (typeof error === "string") {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      result: "Error",
      message: errorMessage,
    } as HTTPResponse;
  }
};
