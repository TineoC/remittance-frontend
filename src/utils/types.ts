export interface HTTPResponse {
  result: "Ok" | "Error";
  message?: string;
  data?: any;
}
