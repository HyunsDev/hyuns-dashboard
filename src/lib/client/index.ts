import { Client } from "hyuns-api-v2-client";

export const client = new Client({
  auth: localStorage.getItem("token") || "",
});
