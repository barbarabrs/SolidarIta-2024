import {
  itemAnimation,
  MotionBox,
} from "../../components/Styles/motion-animate/animate";
import TitlePage from "../../components/TitlePage";
import { ProductListProvider } from "../../contexts/ProductListContext";
import MainProductList from "./Main";

const ProductList = () => {
  return (
    <>
      <ProductListProvider>
        <MotionBox variants={itemAnimation} margin="0 auto" padding={"2rem"}>
          <TitlePage title="Lista de Produtos" />
          <MainProductList />
        </MotionBox>
      </ProductListProvider>
    </>
  );
};

export default ProductList;
