import {
    itemAnimation,
    MotionBox
  } from "../../components/Styles/motion-animate/animate";
  import {
    ProfileProvider
  } from "../../contexts/ProfileContext";
import { MainHistoryUser } from "./Main";
  
  const HistoryUser = () => {
  
    return (
      <>
        <ProfileProvider>
          <MotionBox variants={itemAnimation} margin="0 auto" padding={"2rem"}>
            <MainHistoryUser />
          </MotionBox>
        </ProfileProvider>
      </>
    );
  };
  
  export default HistoryUser;
  