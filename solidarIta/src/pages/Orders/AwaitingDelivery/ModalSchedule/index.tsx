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
  Select,
} from "@chakra-ui/react";
import moment from "moment";
import React, { FormEvent, useState } from "react";
import api from "../../../../services/api";

interface dateTable {
  grocery_list_id: string;
}

function ScheduleModal({ grocery_list_id }: dateTable) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [id] = useState(grocery_list_id);
  const [date, setDate] = useState("");
  const [time, setTime] = useState<string>("");

  const toast = useToast();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    let dateEvent;
    if (date === "tomorrow") {
      dateEvent = moment().add(1, 'day');
    } else {
      dateEvent =  moment();
    }
    const dateTime = moment(`${dateEvent.format('YYYY-MM-DD')} ${time}`).format('YYYY-MM-DD HH:mm:ssZ');
    api
      .post("groceryList/scheduleOrder", { id, scheduleDate: dateTime })
      .then(() => {
        setDate("");
        setTime("");
        toast({
          title: "Entrega agendada.",
          description: "Entrega agendada com sucesso.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        onClose();
        window.location.reload()
      })
      .catch(() => {
        toast({
          title: "Erro desconhecido",
          description: "Verifique as informações e tente novamente",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  };

  const handleDateChange = (event: any) => {
    setDate(event.target.value);
  };

  const handleTimeChange = (event: any) => {
    setTime(event.target.value);
  };

  const closeModal = () => {
    onClose();
    setDate("");
    setTime("");
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme={"facebook"} mr="4">
        Preparar pedido para a entrega
      </Button>

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent color={useColorModeValue("gray.800", "white")}>
          <form onSubmit={handleSubmit}>
            <ModalHeader color={useColorModeValue("#205d8b", "white")}>
              Agendar entrega
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl mt={4} isRequired>
                <FormLabel htmlFor="email">
                  Escolha quando entregar o pedido
                </FormLabel>
                <Select value={date} onChange={handleDateChange}>
                  <option value="today">Hoje</option>
                  <option value="tomorrow">Amanhã</option>
                </Select>
              </FormControl>
              <br />
              <FormControl isRequired>
                <FormLabel htmlFor="email">Horário</FormLabel>
                <Input
                  type="time"
                  value={time}
                  onChange={handleTimeChange}
                  placeholder="HH:mm"
                />
              </FormControl>
              <br />
            </ModalBody>

            <ModalFooter>
              <Button
                className="color_main"
                mr={3}
                type="submit"
                value="submit"
              >
                Agendar entrega
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

export default ScheduleModal;
