import React from "react";
import {
  Box,
  Text,
  Input,
  Stack,
  Select,
  Button,
  Icon,
  Heading,
  SlideFade,
  InputLeftElement,
  InputGroup,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { LinkIcon, CheckIcon, StarIcon } from "@chakra-ui/icons";
import { LiaLanguageSolid } from "react-icons/lia";

export default function HomePageInputs({
  error,
  youtubeLink,
  setYoutubeLink,
  language,
  setLanguage,
  celebrityVoice,
  setCelebrityVoice,
  handleTranslate,
}) {
  return (
    <Box width="full" maxW="2xl" p="8" borderRadius="lg">
      <Box className="mb-4">
        <Heading fontSize="3xl" color="white">
          Insert YouTube Link To Translate Audio
        </Heading>
        {error && (
          <Alert status="error" mb="4">
            <AlertIcon />
            {error}
          </Alert>
        )}
      </Box>
      {/* Enter Youtube link */}
      <Text fontSize="lg" color="black" textAlign="left">
        YouTube Link
      </Text>
      <Stack direction="row" align="center" spacing={4} width="full" maxW="2xl">
        <Icon as={LinkIcon} color="gray.500" w={5} h={5} alignSelf="center" />

        <InputGroup>
          <Input
            placeholder="Type in YouTube Link"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            _placeholder={{
              opacity: 1,
              color: "black",
              fontFamily: "Poppins",
            }}
            mb="6"
            pl="10px" // Adjust padding left as needed to visually match Select fields
            borderColor="grey"
            style={{ color: "black", fontFamily: "Poppins", width: "100%" }} // Ensure full width usage within the group
          />
        </InputGroup>
      </Stack>

      {/* Select language */}
      <Text fontSize="lg" color="black" textAlign="left" mb="4">
        Language
      </Text>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          color="gray.500"
          fontSize="1.7em"
        >
          <Icon as={LiaLanguageSolid} />
        </InputLeftElement>
        <Select
          placeholder="Select Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          color="black"
          mb="6"
          pl="40px" // Add left padding to make room for the icon
          borderColor="grey"
          _placeholder={{ opacity: 0.6 }} // Style the placeholder as needed
        >
          <option value="English">English</option>
          <option value="Chinese">Chinese</option>
          <option value="French">French</option>
        </Select>
      </InputGroup>

      {/* Conditional rendering of Celebrity Voice based on language selection */}
      {language === "English" && (
        <>
          {language === "English" && (
            <SlideFade
              in={language === "English" || language !== "English"}
              offsetY="20px"
            >
              <>
                <Text fontSize="lg" color="black" textAlign="left" mb="4">
                  Celebrity Voice
                </Text>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="yellow.500"
                    fontSize="1.7em"
                  >
                    <Icon as={StarIcon} />
                  </InputLeftElement>
                  <Select
                    placeholder="No Celebrity Voice"
                    value={celebrityVoice}
                    onChange={(e) => setCelebrityVoice(e.target.value)}
                    color="black"
                    mb="8"
                    pl="40px"
                    borderColor="grey"
                    _placeholder={{ opacity: 0.6 }}
                  >
                    <option value="Obama">Obama</option>
                    <option value="Gordon Ramsay">Gordon Ramsay</option>
                  </Select>
                </InputGroup>
              </>
            </SlideFade>
          )}
        </>
      )}

      <Button
       
        backgroundColor="transparent"
        border="2px"
        borderColor="grey"
        borderRadius="full"
        size="lg"
        width="50%"
        _hover={{ bg: "teal.500", color: "white", borderColor: "transparent" }}
        onClick={handleTranslate}
        rightIcon={<Icon as={CheckIcon} />}
      >
        Translate
      </Button>
    </Box>
  );
}
