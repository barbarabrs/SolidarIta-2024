import {
  itemAnimation,
  MotionBox,
} from "../../components/Styles/motion-animate/animate";
import TitlePage from "../../components/TitlePage";
import { OrdersProvider } from "../../contexts/OrdersContext";
import MainOrders from "./Main";

const Orders = () => {
  return (
    <>
      <OrdersProvider>
        <MotionBox variants={itemAnimation} margin="0 auto" padding={"2rem"}>
          <TitlePage title="Pedidos" />
          <MainOrders />
        </MotionBox>
      </OrdersProvider>
    </>
  );
};

export default Orders;
