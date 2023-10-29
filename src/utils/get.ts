import { ENDPOINT_URL_UNDEFINED, JSON_Headers } from "./consts";
import { HTTPResponse } from "./types";

export const get = async (
  serviceName: string,
  headers = JSON_Headers
): Promise<HTTPResponse> => {
  try {
    const { REACT_APP_ENDPOINT_URL } = process.env;
    if (!REACT_APP_ENDPOINT_URL) {
      return {
        result: "Error",
        message: ENDPOINT_URL_UNDEFINED,
      } as HTTPResponse;
    }

    const response = await fetch(`${REACT_APP_ENDPOINT_URL}${serviceName}`, {
      method: "GET",
      headers,
    });

    if (response.ok) {
      const data = await response.json();
      return {
        result: "Ok",
        data,
      } as HTTPResponse;
    } else {
      return {
        result: "Error",
        message: `${response.status} - ${response.statusText}`,
      } as HTTPResponse;
    }
  } catch (error) {
    let errorMessage = "Unhandled error.";

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
