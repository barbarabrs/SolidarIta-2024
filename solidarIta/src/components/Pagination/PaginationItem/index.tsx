import { Button } from '@chakra-ui/react';

interface IPaginationItemProps {
  pageNumber: number;
  isCurrent?: boolean;
  onPageChange: (page: number) => void;
}

export function PaginationItem({
  isCurrent = false,
  pageNumber,
  onPageChange,
}: IPaginationItemProps): JSX.Element {
  if (isCurrent) {
    return (
      <Button
        
        size="sm"
        fontSize="xs"
        width="4"
        colorScheme="blue"
        color="white"
        disabled
        _disabled={{
          bg: 'blue.500',
          cursor: 'default',
        }}
      >
        {pageNumber}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      fontSize="xs"
      width="4"
      bg="gray.600"
      color='white'
      _hover={{
        bg: 'gray.400',
      }}
      onClick={() => onPageChange(pageNumber)}
    >
      {pageNumber}
    </Button>
  );
}
