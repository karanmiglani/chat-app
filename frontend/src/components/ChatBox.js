import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";



const ChatBox = ({fetChatsAgain , setFetchChatsAgain}) => {
    const {selectedChat} = ChatState();
    return (
        <Box 
        display={{base : selectedChat ? "flex" : "none" , md:"flex"}}
        flexDir={"column"}
        alignItems={"center"}
        p={3}
        bg={"white"}
        w={{base:"100%",md:"68%"}}
        borderRadius={"lg"}
        borderWidth={"1px"}
        >

            <SingleChat fetChatsAgain={fetChatsAgain} setFetchChatsAgain={setFetchChatsAgain} />
        </Box>
    )
}

export default ChatBox;