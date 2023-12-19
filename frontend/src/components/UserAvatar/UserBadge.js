import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

function UserBadge({user,handleFunction}) {
  return (
    <Box
    px={2}
    py={1}
    borderRadius={"lg"}
    m={1}
    mb={2}
    variant="solid"
    fontSize={12}
    backgroundColor="purple"
    color={"white"}
    cursor={"pointer"}
    onClick={handleFunction}
    >
        {user.name}
        <CloseIcon ml={2} pl={2} fontSize={"lg"} color={"red"}></CloseIcon>
    </Box>
  )
}

export default UserBadge