import React from "react";
import { Input, Select, Button, Box, Heading, Text } from "@chakra-ui/react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-my-image bg-cover bg-center">
      <Box className="flex flex-col items-center justify-center p-4 bg-gray-900 bg-opacity-0 min-h-screen">
        <Heading as="h1" size="2xl" color="white" mb="8">
          Insert YouTube Link To Translate Audio
        </Heading>
        <Box
          width="full"
          maxW="2xl"
          p="8"
          bg="white"
          borderRadius="lg"
          boxShadow="xl"
        >
          <Text fontSize="lg" mb="4">
            YouTube Link
          </Text>
          <Input placeholder="Type in YouTube Link" mb="4" />
          <Text fontSize="lg" mb="4">
            Language
          </Text>
          <Select placeholder="Select Language" mb="8">
            <option>English</option>
            <option>Chinese</option>
            <option>French</option>
            <option>Korean</option>
          </Select>
          <Button colorScheme="blue" size="lg" width="full">
            Translate
          </Button>
        </Box>
      </Box>
    </div>
  );
}
