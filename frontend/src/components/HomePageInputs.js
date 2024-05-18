import React from "react";
import { Box, 
  Text, 
  Input, 
  Stack,
  Select, 
  Button, 
  Icon,
  Collapse,
  SlideFade,
  InputLeftElement,
  InputGroup,} from "@chakra-ui/react";
import { LinkIcon, CheckIcon,StarIcon } from '@chakra-ui/icons';
import { LiaLanguageSolid } from "react-icons/lia";

export default function HomePageInputs({
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
      {/* Enter Youtube link */}
      <Text fontSize="lg" color="white" textAlign="left">
        YouTube Link
      </Text>
      <Stack direction="row" align="center" spacing={4} width="full" maxW="2xl">
            <Icon as={LinkIcon} color="gray.300" w={5} h={5} alignSelf="center" />

            <InputGroup>
                <Input
                    placeholder="Type in YouTube Link"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    _placeholder={{
                        opacity: 1,
                        color: "white",
                        fontFamily: "Poppins",
                    }}
                    mb="6"
                    pl="10px"  // Adjust padding left as needed to visually match Select fields
                    style={{ color: "white", fontFamily: "Poppins", width: "100%" }}  // Ensure full width usage within the group
                />
            </InputGroup>
        </Stack>
     
     

      {/* Select language */}
      <Text fontSize="lg" color="white" textAlign="left" mb="4">
        Language
      </Text>
      <InputGroup>
        <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.7em">
          <Icon as={LiaLanguageSolid} />
        </InputLeftElement>
        <Select
          placeholder="Select Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          color="white"
          mb="6"
          pl="40px"  // Add left padding to make room for the icon
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
        <SlideFade in={language === "English" || language!== "English"} offsetY='20px'>
          <>
            <Text fontSize="lg" color="white" textAlign="left" mb="4">
              Celebrity Voice
            </Text>
            <InputGroup>
              <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.7em">
                <Icon as={StarIcon} />
              </InputLeftElement>
              <Select
                placeholder="No Celebrity Voice"
                value={celebrityVoice}
                onChange={(e) => setCelebrityVoice(e.target.value)}
                color="white"
                mb="8"
                pl="40px"
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
        colorScheme="blue"
        size="lg"
        width="full"
        onClick={handleTranslate}
        rightIcon={<Icon as={CheckIcon} />}
      >
        Translate
      </Button>
    </Box>
  );
}
