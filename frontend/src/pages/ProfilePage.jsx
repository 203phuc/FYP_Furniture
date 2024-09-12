import React, { useState } from "react";
import ProfileSideBar from "../components/profile/ProfileSideBar.jsx";
import ProfileContent from "../components/profile/ProfileContent.jsx";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const [active, setActive] = useState(1);
  console.log(active);

  return (
    <div className="w-full min-h-screen bg-[#f5f5f5] flex justify-center">
      <div className="w-full flex flex-col 800px:flex-row bg-white">
        {/* Sidebar */}
        <div className="800px:w-[400px] w-full p-4 bg-gray-100">
          <ProfileSideBar active={active} setActive={setActive} />
        </div>

        {/* Content ofprofile*/}
        <div className="w-full">
          <ProfileContent active={active} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
