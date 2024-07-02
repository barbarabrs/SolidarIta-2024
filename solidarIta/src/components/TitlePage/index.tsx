import { Box, Divider, Heading } from "@chakra-ui/react"

interface dataTitlePage {
  title: string
}

function TitlePage({title}: dataTitlePage): JSX.Element {
  return (
    <>
      <Box>
        <Heading mb={3}>{title}</Heading>
      </Box>
      <Divider borderColor='100' mb='1rem' />
    </>
  );
}

 export default TitlePage