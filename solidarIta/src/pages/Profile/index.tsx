import {
  itemAnimation,
  MotionBox
} from "../../components/Styles/motion-animate/animate";
import {
  ProfileProvider
} from "../../contexts/ProfileContext";
import MainProfile from "./main";

const Profile = () => {

  return (
    <>
      <ProfileProvider>
        <MotionBox variants={itemAnimation} margin="0 auto" padding={"2rem"}>
          <MainProfile />
        </MotionBox>
      </ProfileProvider>
    </>
  );
};

export default Profile;
