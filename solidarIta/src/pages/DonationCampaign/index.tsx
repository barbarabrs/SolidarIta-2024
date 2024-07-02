import {
    itemAnimation,
    MotionBox
  } from "../../components/Styles/motion-animate/animate";
import TitlePage from "../../components/TitlePage";
import { DonationCampaignProvider } from "../../contexts/DonationCampaignContext";
import MainDonationCampaign from "./Main";

  
  const DonationCampaign = () => {
  
    return (
      <>
        <DonationCampaignProvider>
          <MotionBox variants={itemAnimation} margin="0 auto" padding={"2rem"}>
            <TitlePage title='Minhas Campanhas de Doação' />
            <MainDonationCampaign />
          </MotionBox> 
        </DonationCampaignProvider>
      </>
    );
  };
  
  export default DonationCampaign;
  