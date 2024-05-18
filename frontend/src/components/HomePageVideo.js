import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  Text,
  Button,
  VStack,
  Textarea,
  Input,
  IconButton,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

export default function HomePageVideo({ videoDetails, handleReset }) {
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const lastMessageRef = useRef(null);

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        { text: currentMessage, sender: "user" },
      ]);
      console.log(currentMessage);
      setCurrentMessage("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      // Prevent sending empty messages
      event.preventDefault(); // Prevent the default action of the enter key (new line)
      handleSendMessage();
    }
  };

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <Box p={5}>
      <Flex justifyContent="flex-end" mb={1}>
        <Button colorScheme="blue" onClick={handleReset} size="sm" mt={-3}>
          Back
        </Button>
      </Flex>
      <Grid
        templateRows="repeat(1, 1fr)"
        templateColumns="repeat(12, 1fr)"
        gap={4}
      >
        <GridItem colSpan={5}>
          <VStack spacing={4}>
            <Image
              src={videoDetails.thumbnail}
              alt="Video Thumbnail"
              boxSize="100%"
              objectFit="cover"
              borderRadius="lg"
            />
            <Text fontSize="lg" color="white">
              Title: {videoDetails.title}
            </Text>
            <Text fontSize="lg" color="white">
              Language: {videoDetails.language}
            </Text>
            {videoDetails.language === "English" &&
              videoDetails.celebrityVoice && (
                <Text fontSize="lg" color="white">
                  Celebrity Voice: {videoDetails.celebrityVoice}
                </Text>
              )}
          </VStack>
        </GridItem>
        <GridItem colSpan={7}>
          <Box
            height="calc(100vh - 100px)"
            bg="gray.100"
            p={3}
            borderRadius="lg"
            overflowY="auto"
            display="flex"
            flexDirection="column"
          >
            <Text fontSize="lg" color="gray.700">
              Transcript (auto-generated):
            </Text>
            <Textarea
              value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse..."
              readOnly
              height="50%"
            />
            <VStack spacing={4} flexGrow={1}>
              <Text fontSize="lg" color="gray.700">
                Chat:
              </Text>
              <Box
                bg="white"
                p={3}
                borderRadius="md"
                overflowY="auto"
                height="300px"
                width="100%"
                mb={2}
              >
                {chatMessages.map((msg, index) => (
                  <Flex
                    key={index}
                    justifyContent="flex-end" // Pushes the bubble container to the right
                    ref={
                      index === chatMessages.length - 1 ? lastMessageRef : null
                    }
                  >
                    <Box
                      bg="blue.100"
                      p={2}
                      borderRadius="lg"
                      maxWidth="fit-content" // Adjusts width to content
                      alignSelf="flex-end" // Ensures the bubble stays at the bottom right
                    >
                      <Text fontSize="sm" textAlign="left">
                        {msg.text}
                      </Text>{" "}
                    </Box>
                  </Flex>
                ))}
              </Box>
              <Flex>
                <Input
                  placeholder="Type your message..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  flex="1"
                  width="500px"
                  mr={2}
                />
                <IconButton
                  icon={<ArrowForwardIcon />}
                  colorScheme="blue"
                  onClick={handleSendMessage}
                  aria-label="Send Message"
                  className="mt-3.5"
                />
              </Flex>
            </VStack>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}
