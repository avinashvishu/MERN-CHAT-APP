import { AddIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/layout";
import React from "react";

const UserBadgeItemAdd = ({ loggedUser, user, handleFunction }) => {
  if (user._id === loggedUser._id) {
    return;
  } else {
    return (
      <Box
        px={2}
        py={1}
        borderRadius="lg"
        m={1}
        mb={2}
        bg="green"
        fontSize={12}
        color="white"
        cursor="pointer"
        onClick={handleFunction}
      >
        {user.name}
        <AddIcon ml={2} mb={1} />
      </Box>
    );
  }
};

export default UserBadgeItemAdd;
