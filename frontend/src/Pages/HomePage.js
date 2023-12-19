import { Box, Container, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";

const Homepage = () => {

    const navigate = useNavigate();
    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("user_info"));
        if(userInfo){
           navigate('/chats'); 
        }
    },[navigate]);
    return (
        <Container maxW="xl" centerContent>
            <Box
                d="flex"
                justifyContent="center"
                p={3}
                bg="white"
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Text fontSize="4xl" fontFamily="Work sans" textAlign="center">
                    Talk-A-Tive
                </Text>
            </Box>
            <Box bg={"white"} w={"100%"} p={4} borderRadius={"lg"} borderWidth={"1px"}>
                <Tabs variant='soft-rounded' colorScheme='blue'>
                    <TabList mb="1em">
                        <Tab width={"50%"}>Login</Tab>
                        <Tab width={"50%"}>Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <SignUp />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>

    )
}

export default Homepage;