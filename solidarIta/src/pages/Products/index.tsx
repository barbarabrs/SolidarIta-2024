import {
    itemAnimation,
    MotionBox
  } from "../../components/Styles/motion-animate/animate";
  import {
    ProfileProvider
  } from "../../contexts/ProfileContext";
  import MainProductsList from "./Main";
  
  const ProductsList = () => {
  
    return (
      <>
        <ProfileProvider>
          <MotionBox variants={itemAnimation} margin="0 auto" padding={"2rem"}>
            <MainProductsList />
          </MotionBox>
        </ProfileProvider>
      </>
    );
  };
  
  export default ProductsList;
  