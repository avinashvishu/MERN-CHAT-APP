import { AtSignIcon, CloseIcon, DeleteIcon, StarIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/layout";
import React from "react";
import { Badge } from "@chakra-ui/layout";

const UserBadgeItem = ({ user, loggedUser, handleFunction, admin }) => {
  if (user._id === loggedUser._id) {
    return (
      <Box
        px={2}
        py={1}
        borderRadius="lg"
        m={1}
        mb={2}
        bg="purple.500"
        fontSize={12}
        color="white"
        cursor="pointer"
      >
        {user.name}
        <StarIcon ml={2} mb={1} />
      </Box>
    );
  } else {
    return (
      <Box
        px={2}
        py={1}
        borderRadius="lg"
        m={1}
        mb={2}
        bg="purple.500"
        fontSize={12}
        color="white"
        cursor="pointer"
        onClick={handleFunction}
      >
        {user.name}
        {admin._id === user._id ? (
          <AtSignIcon ml={2} mb={1} />
        ) : (
          <DeleteIcon ml={2} mb={1} />
        )}
      </Box>
    );
  }
};
export const UserBadgeItemCreate = ({ user, handleFunction, admin }) => {
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="purple"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.name}
      {admin._id === user._id && (
        <span style={{ paddingLeft: "1rem", paddingRight: "5px" }}>
          (Admin)
        </span>
      )}
      <CloseIcon pl={1} />
    </Badge>
  );
};

export default UserBadgeItem;
