import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
  useDisclosure,
  useToast,
  Text,
  Box,
  Flex,
} from "@chakra-ui/react";
import moment from "moment";
import { parseCookies } from "nookies";
import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductsList } from "../../../../contexts/ProductListContext";
import api from "../../../../services/api";

interface dateTable {
  grocery_list_id: string;
  itens: ProductsList[];
  value: string;
  pix: string;
}

function PaymentModal({ grocery_list_id, itens, value, pix }: dateTable) {
  const cookies = parseCookies();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [id] = useState(grocery_list_id);
  const [date, setDate] = useState("");
  const [time, setTime] = useState<string>("");
  const navigate = useNavigate();

  const toast = useToast();

  const handlerPayment = () => {
    const donor_id = cookies["id"];
    api
      .post("groceryList/payment", {
        grocery_list_id,
        products_ids: itens.map((product) => product.id),
        ...(donor_id && {donor_id}),
      })
      .then(() => {
        toast({
          title: "Entrega agendada.",
          description: "Entrega agendada com sucesso.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        onClose();
        navigate("/approved");
      })
      .catch(() => {
        toast({
          title: "Erro desconhecido",
          description: "Verifique as informações e tente novamente",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        onClose();
      });
  };

  const closeModal = () => {
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme={"facebook"} mr="4">
        Prosseguir para o pagamento
      </Button>

      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={closeModal}
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent color={useColorModeValue("gray.800", "white")}>
          <ModalHeader color={useColorModeValue("#205d8b", "white")}>
            Finalizar pagamento
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Valor a pagar</Text>
            <Box fontWeight={"bold"} fontSize={"18px"}>
              R${value}
            </Box>
            <br />
            <Text>Itens selecionados</Text>
            {itens.map((product) => (
              <Box border="1px solid black" p="2" borderRadius={"5px"} mb="3px">
                <Flex justifyContent={"space-between"}>
                  <Box>Produto:{" " + product.name}</Box>
                  <Box>Preço: {" " + product.price}</Box>
                  <Box>Quantidade: {" " + product.amount}</Box>
                </Flex>
              </Box>
            ))}
            <br />
            <Text>Pagamento</Text>
            <Box fontWeight={"bold"} fontSize={"18px"}>
              Pagamento por pix: {pix}
            </Box>

            <br />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={"facebook"} mr={3} onClick={handlerPayment}>
              Confirmar o envio do pix
            </Button>
            <Button onClick={closeModal} colorScheme="red">
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PaymentModal;
