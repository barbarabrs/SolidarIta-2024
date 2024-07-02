import {
  Box,
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
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { parseCookies } from "nookies";
import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../services/api";

interface dateTable {
  available: boolean;
  volunteer_id: string;
  place: string;
  schedule: string;
}

function SubscribeModal({
  available,
  volunteer_id,
  place,
  schedule,
}: dateTable) {
  const cookies = parseCookies();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [id] = useState(volunteer_id);
  const [phone, setPhone] = useState<string>("");
  const [errorInvalidPhone, setErrorInvalidPhone] = useState(
    "Número de telefone incompleto"
  );
  const navigate = useNavigate();

  const toast = useToast();

  const handlerSubscribe = (event: FormEvent) => {
    event.preventDefault();
    const donor_id = cookies["id"];
    api
      .post("volunteer/subscribe", {
        volunteer_id,
        phone: phone.replace(/[^\d]/g, ""),
        ...(donor_id && { donor_id }),
      })
      .then(() => {
        toast({
          title: "Inscrição salva.",
          description: "Inscrição salva com sucesso.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        onClose();
        navigate("/approvedVolunteer");
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

  const handlerCancel = (event: FormEvent) => {
    event.preventDefault();
    const donor_id = cookies["id"];
    api
      .post("volunteer/unsubscribe", {
        volunteer_id,
        ...(donor_id && { donor_id }),
      })
      .then(() => {
        toast({
          title: "Inscrição cancelada.",
          description: "Inscrição cancelada com sucesso.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        onClose();
        navigate("/feed");
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const onlyNums = value.replace(/[^\d]/g, "");

    if (onlyNums.length > 11) {
      return;
    }

    let formattedValue = onlyNums;
    if (onlyNums.length > 2 && onlyNums.length <= 7) {
      formattedValue = `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(2)}`;
    } else if (onlyNums.length > 7 && onlyNums.length <= 11) {
      formattedValue = `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(
        2,
        7
      )}-${onlyNums.slice(7)}`;
    }

    setPhone(formattedValue);

    if (onlyNums.length < 11) {
      setErrorInvalidPhone("Número de telefone incompleto");
    } else {
      setErrorInvalidPhone("");
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme={"facebook"} mr="4">
        {available ? "Me inscrever" : "Cancelar inscrição"}
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
            {available ? "Inscrever na campanha" : "Cancelar inscrição"}
          </ModalHeader>
          <ModalCloseButton />
          <form
            onSubmit={available ? handlerSubscribe : handlerCancel}
            autoComplete="nope"
          >
            {available ? (
              <ModalBody>
                <Text fontWeight={"bold"}>Campanha de voluntariado</Text>
                <br />
                <Text fontWeight={"bold"}>Data e Horário</Text>
                <Text> {schedule}</Text>
                <br />
                <Text fontWeight={"bold"}>Local</Text>
                <Text>{place}</Text>
                <br />

                <Box>
                  <FormControl isRequired>
                    <FormLabel htmlFor="phone" fontWeight={"bold"}>
                      Por favor, insira seu contato para que a instituição possa
                      contatá-lo, se necessário
                    </FormLabel>
                    <Input
                      isRequired
                      size="lg"
                      borderRadius={"100px"}
                      focusBorderColor="#205d8b"
                      variant="filled"
                      color={"black"}
                      type="tel"
                      placeholder="Número de telefone"
                      value={phone}
                      onChange={handlePhoneChange}
                    />
                  </FormControl>
                </Box>
              </ModalBody>
            ) : (
              <ModalBody>
                <Text fontWeight={"bold"}>Campanha de voluntariado</Text>
                <br />
                <Text fontWeight={"bold"}>Data e Horário</Text>
                <Text> {schedule}</Text>
                <br />
                <Text fontWeight={"bold"}>Local</Text>
                <Text>{place}</Text>
                <br />
              </ModalBody>
            )}

            <ModalFooter>
              <Button
                colorScheme={"facebook"}
                mr={3}
                value="submit"
                type="submit"
                isDisabled={!!errorInvalidPhone && available}
              >
                {available
                  ? "Confirmar inscrição de voluntariado"
                  : "Confirmar cancelamento de inscrição"}
              </Button>
              <Button onClick={closeModal} colorScheme="red">
                Cancelar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

export default SubscribeModal;
