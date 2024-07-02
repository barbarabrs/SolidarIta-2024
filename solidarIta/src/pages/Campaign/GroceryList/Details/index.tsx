import React from "react";
import {
  itemAnimation,
  MotionBox,
} from "../../../../components/Styles/motion-animate/animate";
import { OrdersProvider } from "../../../../contexts/OrdersContext";
import { MainDetailsCampaign } from "./Main";

export function DetailsCampaign() {
  return (
    <>
      <OrdersProvider>
        <MotionBox variants={itemAnimation} margin="0 auto" padding={"2rem"}>
          <MainDetailsCampaign />
        </MotionBox>
      </OrdersProvider>
    </>
  );
}
