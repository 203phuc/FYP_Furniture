import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVerifyEmailMutation } from "../redux/slices/userApiSlice"; // Make sure you have this hook set up

const VerifyPage = () => {
  const [status, setStatus] = useState(""); // To store the verification status message
  const [searchParams] = useSearchParams(); // Extract URL parameters
  const token = searchParams.get("token"); // Get the 'token' parameter from the URL
  const [verifyEmail] = useVerifyEmailMutation(); // Hook for email verification API call
  const navigate = useNavigate(); // For navigation after successful verification
  console.log("token", token);

  useEffect(() => {
    const verifyUserEmail = async () => {
      if (!token) {
        // Token is missing
        setStatus("Invalid or missing token");
        return;
      }

      try {
        // Call the mutation hook for verifying the email with the token
        const result = await verifyEmail({ token }).unwrap(); // Unwrap to get the response
        setStatus(result.message); // Set status message from response
        console.log("token", token);

        // If verification is successful, redirect to login or another page
        setTimeout(() => {
          navigate("/login"); // Redirect to login page after a successful verification
        }, 3000);
      } catch (error) {
        setStatus("Verification failed. Please try again.");
      }
    };

    // Call the verification function when the component mounts
    verifyUserEmail();
  }, [token, verifyEmail, navigate]);

  return (
    <div>
      <h2>{status}</h2> {/* Display the verification status */}
      <p>
        If you are successfully verified, you'll be redirected to the login
        page.
      </p>
    </div>
  );
};

export default VerifyPage;
