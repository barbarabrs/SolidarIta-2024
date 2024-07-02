import React from "react";
import {
  itemAnimation,
  MotionBox
} from "../../../components/Styles/motion-animate/animate";
import { OrdersProvider } from "../../../contexts/OrdersContext";
import { MainCampaignVolunteer } from "./Main";

export function CampaignVolunteer ({ history, finished, log }: { history?: boolean, finished?: boolean, log?: boolean}) {
  return (
    <>
      <OrdersProvider>
        <MotionBox variants={itemAnimation} margin="0 auto" padding={"2rem"}>
          {/* <TitlePage title="" /> */}
          <MainCampaignVolunteer history={history ?? false} finished={finished ?? false} log={log ?? false}/>
        </MotionBox>
      </OrdersProvider>
    </>
  );
}
