import React from "react";
import {
  itemAnimation,
  MotionBox
} from "../../../components/Styles/motion-animate/animate";
import { OrdersProvider } from "../../../contexts/OrdersContext";
import { MainFinishedOrders } from "./Main";

export function FinishedOrders() {
  return (
    <>
      <OrdersProvider>
        <MotionBox variants={itemAnimation} margin="0 auto" padding={"2rem"}>
          {/* <TitlePage title="" /> */}
          <MainFinishedOrders />
        </MotionBox>
      </OrdersProvider>
    </>
  );
}
