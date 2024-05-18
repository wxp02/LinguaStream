import React from "react";
import { IconButton } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

export default function CustomHamburgerIcon({ onOpen }) {
  return (
    <IconButton
      icon={<HamburgerIcon />}
      aria-label="Open Menu"
      onClick={onOpen}
      color="white"
      backgroundColor="transparent"
      _hover={{ bg: "transparent", opacity: 0.8 }}
      _active={{ bg: "transparent" }}
      sx={{ fontSize: "36px", padding: "12px" }}
      position="absolute"
      top="4"
      left="4"
    />
  );
}
