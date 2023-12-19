
import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/Misc/SideDrawer";
import MyChats from "../components/Mychats";
import ChatBox from "../components/ChatBox";



const ChatPage = () => {
    const {user} = ChatState();
    const [fetChatsAgain, setFetchChatsAgain] = useState(false);
    return <div style={{width:"100%"}}>
        {user && <SideDrawer />}
        <Box
        display={"flex"} 
        justifyContent={"space-between"} 
        w={"100%"} 
        h={"90vh"}
        p={"10px"}
        >
            {user && <MyChats fetChatsAgain={fetChatsAgain} />}
            {user && <ChatBox fetChatsAgain={fetChatsAgain} setFetchChatsAgain={setFetchChatsAgain} />}
        </Box>
      
        </div> 
}

export default ChatPage;