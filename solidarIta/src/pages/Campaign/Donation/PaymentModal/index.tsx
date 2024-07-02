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
  warning: string;
  donation_id: string;
  value: string;
  pix: string;
}

function PaymentModal({ warning, donation_id, value, pix }: dateTable) {
  const cookies = parseCookies();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [id] = useState(donation_id);
  const navigate = useNavigate();

  const toast = useToast();

  const handlerPayment = () => {
    const donor_id = cookies["id"];
    api
      .post("donation/payment", {
        donation_id,
        amount: value.replace(",", "."),
        ...(donor_id !== "" && { donor_id: donor_id }),
      })
      .then(() => {
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
      <Button
        onClick={onOpen}
        colorScheme={"facebook"}
        mr="4"
        isDisabled={
          isNaN(parseFloat(value)) || parseFloat(value) <= 0.0 || warning !== ""
        }
      >
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
              {parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Box>
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
