import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./Misc/GroupChatModal";


const Mychats = ({fetChatsAgain}) => {
    const [loggesUser, setLoggesUSer] = useState();
    const {user} = ChatState();

    const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
    
    const toast = useToast();

    useEffect(() => {
        setLoggesUSer(JSON.parse(localStorage.getItem("user_info")));
        fetchChats();
    }, [fetChatsAgain])
    const fetchChats = async () => {
        try {
            const config = {

                headers: { Authorization: `Bearer ${user.token}` }
            }
            const { data } = await axios.get('http://localhost:4000/api/chat/all-chats', config);
            setChats(data);
        } catch (err) {
            toast({
                title: "Error Occured!",
                description: err.message,
                status: "error",
                position: "top",
                isClosable: true,
                duration: 5000
            })
        }
    }

    return <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir={"column"}
        alignItems={"center"}
        p={3}
        bgColor={"white"}
        w={{ base: "100%", md: "31%" }}
        borderRadius={"lg"}
        borderWidth={"1px"}
    >
        <Box
            paddingBottom={3}
            px={3}
            fontSize={{ base: "28px", md: "30px" }}
            fontFamily={"Work sans"}
            display={"flex"}
            width={"100%"}
            justifyContent={"space-between"}
            alignItems={"center"}
        >
            My Chats
            <GroupChatModal>
            <Button
                display={"flex"}
                fontSize={{ base: "10px", md: "10px", lg: "17px" }}
                rightIcon={<AddIcon />}
            >New Group Chat </Button>
            </GroupChatModal>
        </Box>
        <Box
            display={"flex"}
            flexDir={"column"}
            p={3}
            bg={"#F8F8F8"}
            w={"100%"}
            h={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
            >
                
{
chats ? (
    
<Stack overflowY={"scroll"}>
    {
     
        chats.map(chat =>{ 
           
            return (<Box
            onClick={() =>{setSelectedChat(chat)}}
            cursor={"pointer"}
            bg={selectedChat === chat ? "#38B2Ac" : "E8E8E8" }
            color={selectedChat === chat ? "white" : "black"}
            px={3}
            py={2}
            borderRadius={"lg"}
            key={chat._id}
            >
                <Text>
                    {
                        
                        !chat.isGroupChat ? (getSender(loggesUser,chat.users)) : chat.chatName
                    }
                </Text>
                </Box>
        )})
    }
</Stack>
)
:
(<ChatLoading />)
}
        </Box>
    </Box>
}

export default Mychats;