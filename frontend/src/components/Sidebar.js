import React from "react";
import {
  Button,
  Text,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { RepeatClockIcon } from "@chakra-ui/icons";
import { MdExitToApp } from "react-icons/md";

export default function Sidebar({ isOpen, onClose }) {
  let navigate = useNavigate();

  const handleHistory = () => {
    navigate("/history");
  };

  const handleLogout = () => {
    navigate("/");
  };
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader sx={{ fontSize: "24px" }}>LinguaStream</DrawerHeader>
        <DrawerBody>
          <List spacing={5}>
            <ListItem display="flex" alignItems="center">
              <Button onClick={handleHistory} variant="ghost">
                <ListIcon as={RepeatClockIcon} color="gray.500" />
                <Text fontWeight="normal">History</Text>
              </Button>
            </ListItem>
            <ListItem display="flex" alignItems="center">
              <Button onClick={handleLogout} variant="ghost">
                <ListIcon as={MdExitToApp} color="gray.500" />
                <Text fontWeight="normal">Logout</Text>
              </Button>
            </ListItem>
          </List>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
