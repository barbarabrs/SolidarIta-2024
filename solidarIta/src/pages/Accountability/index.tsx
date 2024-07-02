import {
    itemAnimation,
    MotionBox
  } from "../../components/Styles/motion-animate/animate";
  import {
    ProfileProvider
  } from "../../contexts/ProfileContext";
import { MainAccountabilityCampain } from "./Main";
  
  const AccountabilityCampain = () => {
  
    return (
      <>
        <ProfileProvider>
          <MotionBox variants={itemAnimation} margin="0 auto" padding={"2rem"}>
            <MainAccountabilityCampain />
          </MotionBox>
        </ProfileProvider>
      </>
    );
  };
  
  export default AccountabilityCampain;
  