import React from "react";
import {
  itemAnimation,
  MotionBox,
} from "../../../components/Styles/motion-animate/animate";
import { GroceryListProvider } from "../../../contexts/GroceryListContext";
import GroceryListHeader from "./Header";
import GroceryListPartners from "./Partner";
import GroceryListProducts from "./Products";
import Stepper from "./Utils/Stepper";

const CreateGroceryList = ({ step }: { step: number }) => {
  return (
    <GroceryListProvider>
      <MotionBox variants={itemAnimation} margin="0 auto" padding={"0 2rem"}>
        {step === 2 ? (
          <>
            <Stepper step={2} />
            <GroceryListPartners />
          </>
        ) : step === 3 ? (
          <>
            <Stepper step={3} />
            <GroceryListProducts />
          </>
        ) : (
          <>
            <Stepper step={1} />
            <GroceryListHeader />
          </>
        )}
      </MotionBox>
    </GroceryListProvider>
  );
};

export default CreateGroceryList;
