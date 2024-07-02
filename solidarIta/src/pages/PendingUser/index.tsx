import { Box, Heading, Text, Button, Link } from "@chakra-ui/react";
import { Link as ReachLink } from "react-router-dom";

const PendingUser = () => {
  return (
    <Box
      textAlign="center"
      height="100vh"
      display="flex"
      flexDir="column"
      justifyContent="center"
      alignItems="center"
    >
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, green.400, green.600)"
        backgroundClip="text"
      >
        Cadastro Pendente
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Agradecemos pela sua inscrição! Nossos administradores irão avaliá-la.
        <br></br>
        Após validado, seu cadastro será aceito e você poderá acessar nossa
        plataforma. Não se preocupe, você será avisado por e-mail.
      </Text>
    </Box>
  );
};

export default PendingUser;
