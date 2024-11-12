import { USERS_URL } from "../constants.jsx";
import { apiSlice } from "./apiSlice.js";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"], // Invalidate user data after login
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"], // Invalidate user data after registration
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["User"], // Invalidate user data after logout
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"], // Invalidate user profile after update
    }),
    verifyEmail: builder.mutation({
      query: (token) => ({
        url: `${USERS_URL}/verify-email`,
        method: "POST", // Updated to POST for security and consistency
        body: { token },
      }),
      invalidatesTags: ["User"], // Optionally invalidate user data after verification
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useProfileMutation,
  useVerifyEmailMutation,
} = userApiSlice;
