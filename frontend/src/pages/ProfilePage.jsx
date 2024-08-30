import React, { useState } from "react";
import Loader from "../components/layout/Loader.jsx";
import ProfileSideBar from "../components/profile/ProfileSideBar.jsx";
import ProfileContent from "../components/profile/ProfileContent.jsx";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const [active, setActive] = useState(1);

  return (
    <div>
      <>
        <div className="w-11/12 mx-auto flex bg-[#f5f5f5] py-10">
          <div className="w-[50px] 800px:w-[335px] sticky 800px:mt-0 mt-[18%]">
            <ProfileSideBar active={active} setActive={setActive} />
          </div>
          <ProfileContent active={active} />
        </div>
      </>
    </div>
  );
};

export default ProfilePage;
