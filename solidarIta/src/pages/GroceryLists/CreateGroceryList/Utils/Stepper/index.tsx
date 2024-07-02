import { Box, Button, Divider, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const steps = [
  { title: "Campanha", description: "Defina sua campanha" },
  { title: "Parceiro", description: "Escolha o parceiro" },
  {
    title: "Lista de compras",
    description: "Selecione os items para a lista de compras",
  },
];

const Stepper = ({ step }: { step: number }) => {
  const navigate = useNavigate();
  const activeStep = step ?? 1; // Defina o índice do passo ativo aqui

  const link = () => {
    switch (activeStep) {
      case 2:
        return "/groceryList/create/header";
      case 3:
        return "/groceryList/create/partners";
      default:
        return "/groceryList/all";
    }
  };

  const color = (index: number) => {
    switch (activeStep) {
      case 2:
        if (index === 0) {
          return "green";
        } else {
          return "";
        }
      case 3:
        if (index === 0 || index === 1) {
          return "green";
        } else {
          return "";
        }
      default:
        return "";
    }
  };
  return (
    <>
      <Button
        ml="-20px"
        size="xs"
        onClick={() => {
          navigate(link());
        }}
      >
        <IoArrowBack size={"20"} />
      </Button>
      <Flex
        mt="5px"
        flexDirection={"row"}
        w="100%"
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        {steps.map((step, index) => (
          <>
            <Box
              key={index}
              display="inline-flex"
              alignItems="center"
              zIndex={"1000"}
              w="fit-content"
            >
              <Box
                bg={index < activeStep ? "green.500" : "gray.200"}
                color={index < activeStep ? "white" : "gray.600"}
                borderRadius="full"
                w="50px"
                py="3"
                mr={4}
                textAlign={"center"}
              >
                {index + 1}
              </Box>
              <Box>
                <Text fontWeight="bold">{step.title}</Text>
                <Text width="100px" fontSize={"12px"} w="fit-content">
                  {step.description}
                </Text>
              </Box>
            </Box>
            {index !== 2 ? (
              <Divider width={"15%"} border="2" borderColor={color(index)} />
            ) : (
              <></>
            )}
          </>
        ))}
      </Flex>
    </>
  );
};

export default Stepper;
