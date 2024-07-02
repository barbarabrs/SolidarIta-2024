import {
    itemAnimation,
    MotionBox
  } from "../../components/Styles/motion-animate/animate";
import TitlePage from "../../components/TitlePage";
import { GroceryListProvider } from "../../contexts/GroceryListContext";
import MainGroceryList from "./Main";

  
  const GroceryList = () => {
  
    return (
      <>
        <GroceryListProvider>
          <MotionBox variants={itemAnimation} margin="0 auto" padding={"2rem"}>
            <TitlePage title='Minhas Listas de Compras' />
            <MainGroceryList />
          </MotionBox> 
        </GroceryListProvider>
      </>
    );
  };
  
  export default GroceryList;
  