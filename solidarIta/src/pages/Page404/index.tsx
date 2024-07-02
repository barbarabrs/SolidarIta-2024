import { Box, Heading, Text, Button, Link } from "@chakra-ui/react";
import { Link as ReachLink } from "react-router-dom"

const Pagina404 = () => {
  return (
    <Box textAlign="center"  height='100vh' display='flex' flexDir='column' justifyContent='center' alignItems='center'>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, green.400, green.600)"
        backgroundClip="text"
      >
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Page Not Found
      </Text>
      <Text color={"gray.500"} mb={6}>
        The page you're looking for does not seem to exist
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

export default Pagina404;
