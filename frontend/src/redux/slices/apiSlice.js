import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants.jsx";

// this for preparation of the request (auto generate the needed parts of header and body for sending request);
// also set the base URL for avoiding re-write the whole URl: localhost://5000...... for each request
//which is a lightweight fetch wrapper that automatically handles request headers and response parsing in a manner similar to common libraries like axios
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
}); // search for option obj

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User"],
  
  endpoints: (builder) => ({
    //to rerurn obj
  }),
});
