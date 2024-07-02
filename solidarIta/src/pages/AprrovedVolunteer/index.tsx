import { Box, Heading, Text, Button, Link } from "@chakra-ui/react";
import { Link as ReachLink } from "react-router-dom"

const ApprovedVolunteerPage = () => {
  return (
    <Box textAlign="center"  height='100vh' display='flex' flexDir='column' justifyContent='center' alignItems='center'>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, green.400, green.600)"
        backgroundClip="text"
      >
        Inscrição realizada
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Obrigada pela sua ajuda! ela é muito importante para a comunidade, não deixe de comparecer e fazer parte da campanha <br></br>
        Acompanhe as atividades da instituição beneficiada pela tela de prestação de contas
      </Text>
      <Link as={ReachLink} to={'/feed'} style={{ textDecoration: "none" }}>
        <Button
          className="color_main"
          bgGradient="linear(to-r, green.400, #205d8b, green.600)"
          color="white"
          variant="solid"
        >
          Ir para o feed
        </Button>
      </Link>
    </Box>
  );
};

export default ApprovedVolunteerPage;
