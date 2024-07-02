import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Image,
  Select,
  Tag,
  Text,
} from "@chakra-ui/react";
import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GroceryList } from "../../../contexts/GroceryListContext";
import api from "../../../services/api";
import { Product, ProductsList } from "../../../contexts/ProductListContext";
import { OrdersProvider } from "../../../contexts/OrdersContext";
import {
  itemAnimation,
  MotionBox,
} from "../../../components/Styles/motion-animate/animate";
import TitlePage from "../../../components/TitlePage";
import { MainPendingOrders } from "./Main";

export function PendingOrders() {
  return (
    <>
      <OrdersProvider>
        <MotionBox variants={itemAnimation} margin="0 auto" padding={"2rem"}>
          {/* <TitlePage title="" /> */}
          <MainPendingOrders />
        </MotionBox>
      </OrdersProvider>
    </>
  );
}
