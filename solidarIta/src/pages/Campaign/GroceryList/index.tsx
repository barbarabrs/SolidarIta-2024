import React from "react";
import {
  itemAnimation,
  MotionBox
} from "../../../components/Styles/motion-animate/animate";
import { OrdersProvider } from "../../../contexts/OrdersContext";
import { MainCampaignGroceryList } from "./Main";

export function CampaignGroceryList ({ history, finished }: { history?: boolean, finished?: boolean}) {
  return (
    <>
      <OrdersProvider>
        <MotionBox variants={itemAnimation} margin="0 auto" padding={"2rem"}>
          {/* <TitlePage title="" /> */}
          <MainCampaignGroceryList history={history ?? false} finished={finished ?? false}/>
        </MotionBox>
      </OrdersProvider>
    </>
  );
}
