import { apiSlice } from "./apiSlice.jsx";
import { USERS_URL } from "../constants.jsx";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints,
});
