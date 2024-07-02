import React, {FormEvent, useState, useContext} from 'react';
import { FiTrash2 } from "react-icons/fi";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Text,
  useColorModeValue 
} from '@chakra-ui/react'
import api from '../../../../services/api';
interface dateTable{
  user: string;
  id: number;
}

function DeleteModal({ user, id}: dateTable) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [conta, setConta] = useState('')
  const toast = useToast()

  const handleDelete = (event: FormEvent) => {
    event.preventDefault();
  
  
        api.delete(`Blacklist/${id}`)
        .then(() => {
          toast({
            title: 'Usuário Excluído',
            description: "Usuário excluído com sucesso.",
            status: 'success',
            duration: 2000,
            isClosable: true,
          });
          onClose()
        })
        .catch(() =>  {
          toast({
            title: 'Erro desconhecido',
            description: "Verifique as informações e tente novamente",
            status: 'error',
            duration: 2000,
            isClosable: true,
          })
        });
    };

  return (
    <>
      <Button size="xs" variant="outline" 
        onClick={() => {
        onOpen() 
        setConta('')}
      }>
          <FiTrash2 />
      </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent color={useColorModeValue("gray.800", "white")}>
            <form onSubmit={handleDelete}>
              <ModalHeader color={useColorModeValue("#205d8b", "white")}>Deseja Excluir Usuário?</ModalHeader>
              <ModalCloseButton />

              <ModalBody>
              <FormControl>
                <FormLabel >Essa ação não pode ser desfeita, por favor digite {<Text display="inline" color="red" fontSize='md'>{user + ' '}</Text>}para confirmar.</FormLabel>
                  <Input
                  borderColor='100'
                  value={conta}
                  onChange={(event) => {
                    setConta(event.target.value);  
                  }}
                  />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button id="button"
                  disabled={conta !== user}
                  className="color_main" 
                  mr={3} 
                  type='submit'
                  >
                    Excluir
                </Button>
                <Button onClick={onClose} colorScheme='red'>Cancelar</Button>
              </ModalFooter>
              </form>
          </ModalContent>
        </Modal>   
    </>
  )
}

export default DeleteModal