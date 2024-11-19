import React from "react";

const FormContainer = ({ title, children }) => {
  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col  py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[35rem]">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <h1 className="text-2xl font-bold mb-4 text-center">{title}</h1>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default FormContainer;
