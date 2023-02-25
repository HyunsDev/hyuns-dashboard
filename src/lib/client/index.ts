import { HyunsClient } from "hyuns-api-v2-client";

export const client = new HyunsClient({
    auth: localStorage.getItem("token") || "",
    baseUrl: process.env.REACT_APP_API_URL || "",
});
