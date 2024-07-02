import {
    itemAnimation,
    MotionBox
  } from "../../components/Styles/motion-animate/animate";
import TitlePage from "../../components/TitlePage";
import { VolunteerCampaignProvider } from "../../contexts/VolunteerCampaignContext";
import MainVolunteerCampaign from "./Main";

  
  const VolunteerCampaign = () => {
  
    return (
      <>
        <VolunteerCampaignProvider>
          <MotionBox variants={itemAnimation} margin="0 auto" padding={"2rem"}>
            <TitlePage title='Minhas Campanhas de Voluntariado' />
            <MainVolunteerCampaign />
          </MotionBox> 
        </VolunteerCampaignProvider>
      </>
    );
  };
  
  export default VolunteerCampaign;
  