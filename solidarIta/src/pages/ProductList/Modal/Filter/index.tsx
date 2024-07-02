import React, { FormEvent, useContext, useEffect, useState } from 'react';
import { FiFilter } from "react-icons/fi";
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
  useColorModeValue
} from '@chakra-ui/react'
import {
  Select,
} from 'chakra-react-select'

interface FilterModalProps {
  onPage: (value: number) => void;
}
interface dateAccount {
  value: string,
  label: string,
}

interface AccountsList {
  id: string;
  name: string;
}

function FilterModal({onPage}: FilterModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [filterInputCode, setFilterInputCode] = useState('Selecione a conta')
  const [existFilter, setExistFilter] = useState(false)
  const [accountList, setAccountList] = useState<dateAccount[]>([{ value: '', label: '' }])


  const handleFilter = (event: FormEvent) => {
    event.preventDefault();

    if ((filterInputCode)) {
      setExistFilter(true);
    } else {
      setExistFilter(false);
    }
    onPage(1);
    onClose()
  };


  const handleLimpar = (event: FormEvent) => {
    event.preventDefault();

    setFilterInputCode('');
    onClose()
    setFilterInputCode('Selecione a conta')
    setExistFilter(false);
  };

  return (
    <>
      {!existFilter ? <Button className="color_main" variant="outline" onClick={onOpen}>
        Filtrar
      </Button> :
        <Button colorScheme="red" leftIcon={<FiFilter />} variant="outline" onClick={onOpen}>
          Filtrar
        </Button>}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent color={useColorModeValue("gray.800", "white")}>
          <form onSubmit={handleFilter}>
            <ModalHeader color={useColorModeValue("#205d8b", "white")}>Filtrar</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl mt={4} isRequired>
                <FormLabel>Conta</FormLabel>
                <Select   
                  placeholder={filterInputCode}
                  closeMenuOnSelect={false}
                  selectedOptionStyle="check"
                  selectedOptionColor="green"
                  hideSelectedOptions={false}
                  defaultValue={accountList.filter((elem: dateAccount) => filterInputCode === elem.value)}
                  onChange={(event) => {
                    { event?.value ? setFilterInputCode(event.value) : setFilterInputCode('') }
                  }}
                  options={accountList}
                />
              </FormControl>

            </ModalBody>
            <ModalFooter>
              <Button className="color_main" mr={3}
                type='submit'
                value='submit'
              >
                Filtrar
              </Button>
              <Button onClick={handleLimpar} colorScheme='blue' mr={3}>Limpar</Button>
              <Button onClick={onClose} colorScheme='red'>Cancelar</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}

export default FilterModal