import React, { FormEvent, useContext, useState, useEffect } from 'react';
import { IoIosAdd } from "react-icons/io";
import { FiEdit } from 'react-icons/fi';
import api from '../../../../services/api';
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
  Textarea,
  RadioGroup,
  Radio,
  Stack,
  useColorModeValue
} from '@chakra-ui/react'
import {
  Select,
} from 'chakra-react-select'

interface dateTable {
  operation: string,
  data?: {
    id: number;
    mail: string,
    account_id: string;
    type: string,
    reason?: string
  };
}

interface dateAccount {
  value: string,
  label: string,
}

interface AccountsList {
  id: string;
  name: string;
}

function CreateModal({ operation, data }: dateTable) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [accountList, setAccountList] = useState<dateAccount[]>([{ value: '', label: '' }])

  const [id] = useState(data?.id)
  const [account, setAccount] = useState(operation === 'create' ? '' : data?.account_id)
  const [email, setEmail] = useState(operation === 'create' ? '' : data?.mail)
  const [type, setType] = useState(operation === 'create' ? 'Complaint' : data?.type)
  const [reason, setReason] = useState(operation === 'create' ? '' : data?.reason)

  const toast = useToast()

  const handleLoginSubmit = (event: FormEvent) => {
    event.preventDefault();

 
      if (operation === 'create') {

        api.post("Blacklist", { mail: email, account_id: account, type: type, reason: reason })
        .then(() => {
          setAccount('');
          setEmail('');
          setType('');
          setReason('');
          toast({
            title: 'Usuário Cadastrado.',
            description: "Usuário Cadastrado com sucesso.",
            status: 'success',
            duration: 2000,
            isClosable: true,
          });
          onClose();
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

      } else if (operation === 'update') {

        api.put(`Blacklist/${id}`, { mail: email, account_id: account, type: type, reason: reason })
        .then(() => {
          toast({
            title: 'Usuário Atualizado.',
            description: "Usuário atualizado com sucesso.",
            status: 'success',
            duration: 2000,
            isClosable: true,
          });
          onClose();
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
      }

  };

  const closeModal = () => {
    onClose()
    if (operation === 'create') {
      setAccount('');
      setEmail('');
      setType('');
      setReason('');
    }
  }

  return (
    <>
      {operation === 'create' ?
        <Button leftIcon={<IoIosAdd />} className="color_main" variant='solid' onClick={onOpen}>
          Adicionar
        </Button> :
        <Button size="xs" variant="outline" onClick={onOpen}>
          <FiEdit />
        </Button>}

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent color={useColorModeValue("gray.800", "white")}>
          <form onSubmit={handleLoginSubmit}>
            <ModalHeader color={useColorModeValue("#205d8b", "white")}>{operation === 'create' ? 'Criar Usuário' : 'Editar Usuário'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl mt={4} isRequired >
                <FormLabel htmlFor='email'>Account</FormLabel>
                {operation === 'create' ?
                  <Select
                    onChange={(event) => {
                      { event?.value ? setAccount(event?.value) : setAccount('') }
                    }}
                    options={accountList}
                  />
                  :
                  <Select isDisabled placeholder={account} value={account} ></Select>}
              </FormControl>
              <br />
              <FormControl isRequired>
                <FormLabel htmlFor='email'>Email</FormLabel>
                <Input
                  placeholder='Email'
                  maxlength="100"
                  borderColor='100'
                  type='email'
                  value={email}
                  isRequired
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
              </FormControl>
              <br />
              <FormControl isRequired>
                <FormLabel htmlFor='email'>Type</FormLabel>
                <RadioGroup value={type}
                  onChange={setType}
                >
                  <Stack direction='row' display='flex' justifyContent='space-around' >
                    <Radio value='Complaint' className="color_main" >Complaint</Radio>
                    <Radio value='Bounce' className="color_main">Bounce</Radio>
                    <Radio value='Complaints' className="color_main">Complaints</Radio>
                  </Stack>
                </RadioGroup>

              </FormControl>
              <br />
              <FormControl>
                <FormLabel htmlFor='reason'>Reason</FormLabel>
                <Textarea
                  placeholder='reason'
                  maxlength="300"
                  borderColor='100'
                  // type='reasson'
                  value={reason}
                  onChange={(event) => {
                    setReason(event.target.value);
                  }}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button className="color_main" mr={3}
                type='submit'
                value='submit'>
                Salvar
              </Button>
              <Button onClick={closeModal} colorScheme='red'>Cancelar</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateModal