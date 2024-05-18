import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
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
  Icon,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { TbMessageChatbot } from "react-icons/tb";
import { CgTranscript } from "react-icons/cg";
import { IoCaretBack } from "react-icons/io5";

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
      <Flex justifyContent="flex-end">
        <Button
          colorScheme="teal"
          onClick={handleReset}
          size="sm"
          mt={-3}
          leftIcon={<IoCaretBack />}
        >
          Back
        </Button>
      </Flex>
      <Grid
        templateRows="repeat(1, 1fr)"
        templateColumns="repeat(12, 1fr)"
        gap={4}
      >
        <GridItem colSpan={7}>
          <VStack spacing={4} align="stretch">
            <Image
              src={videoDetails.thumbnail}
              alt="Video Thumbnail"
              boxSize="100%"
              objectFit="cover"
              borderRadius="lg"
              mt={3}
            />
            <Text fontSize="lg" color="black">
              Title: {videoDetails.title}
            </Text>
            <Text fontSize="lg" color="black">
              Language: {videoDetails.language}
            </Text>
            {videoDetails.language === "English" &&
              videoDetails.celebrityVoice && (
                <Text fontSize="lg" color="black">
                  Celebrity Voice: {videoDetails.celebrityVoice}
                </Text>
              )}
            <ReactPlayer
              url={videoDetails.videoUrl}
              controls={true}
              playing={true}
              width="100%"
              height="100%"
            />
          </VStack>
        </GridItem>
        <GridItem colSpan={5}>
          <Box
            height="calc(100vh - 100px)"
            bg="transparent"
            p={3}
            borderRadius="lg"
            overflowY="auto"
            display="flex"
            flex="1"
            flexDirection="column"
            width="100%"
          >
            <VStack spacing={4} flex="1" bg="gray.100" p={3} borderRadius="md">
              <Flex alignItems="center">
                <Icon as={CgTranscript} w={8} h={8} color="gray.700" mr={2} />
                <Text fontSize="lg" color="gray.700">
                  Transcript (auto-generated)
                </Text>
              </Flex>

              <Textarea
                value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse..."
                readOnly
                height="100%"
                resize={"none"}
              />
            </VStack>

            <VStack
              spacing={4}
              flex="1"
              bg="gray.100"
              p={4}
              borderRadius="md"
              mt={3}
            >
              <Flex alignItems="center">
                <Icon as={TbMessageChatbot} w={8} h={8} color="gray.700" />
                <Text fontSize="lg" color="gray.700" ml={2}>
                  {" "}
                  {/* Add some left margin to create space between the icon and text */}
                  Chatbot
                </Text>
              </Flex>

              <Box
                bg="white"
                p={3}
                borderRadius="lg"
                overflowY="auto"
                height="100px"
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
                      bg="teal.200"
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
              <Flex width="100%">
                <Input
                  placeholder="Type your message..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  flex="1"
                  //width="500px"
                  //width="100%"
                  mr={2}
                />
                <IconButton
                  icon={<ArrowForwardIcon />}
                  colorScheme="teal"
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
