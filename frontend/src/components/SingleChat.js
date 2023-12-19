import React, { useEffect, useId, useRef, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, FormControl, IconButton, Input, Spinner, Text, VStack, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getFullSender, getSender } from '../config/ChatLogics';
import ProfileModal from './Misc/ProfileModal';
import UpdateGroupChatModal from './Misc/UpdateGroupChatModal';
import axios from 'axios';
import "./style.css";
import ScroolableChat from './ScroolableChat';
import { io } from 'socket.io-client';
import Lottie from 'lottie-react';
import animationData from '../animations/typing.json';
import messageSOund from '../animations/message_sond.wav';
import InputEmoji from 'react-input-emoji'
import {Howl, Howler} from 'howler';


function SingleChat({ fetChatsAgain, setFetchChatsAgain }) {
    const { user, selectedChat, setSelectedChat ,notifiaction , setNotifications } = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [typing,setTyping] = useState(false);
   const [isTyping , setIsTyping] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [userOnline , setOnlineUser] = useState([]);
    const [online , isOnline] = useState(false);
    const socketsRef = useRef(null);
    const selectedChatCompareRef = useRef(null);
    const toast = useToast();
    const ENDPOINT = 'https://talk-a-tive-qe97.onrender.com/'

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      };

      var sound = new Howl({
        src: [messageSOund],
        html5: true
      });
    useEffect(()=> {
        socketsRef.current = io(ENDPOINT);
        try{
            socketsRef.current.emit("setup",user);
            socketsRef.current.on("connected",()=>setSocketConnected(true));
            
            
            socketsRef.current.on('typing',()=>setIsTyping(true));
            socketsRef.current.on('stop typing',()=>setIsTyping(false));
            return () => {
                socketsRef.current.disconnect();
            }
    }catch(error){
        console.log(error);
    }
    },[])
    useEffect(()=>{
        
            socketsRef.current.on("updateUserStatus",(onlineUsers)=>{
            setOnlineUser(onlineUsers);
            })
            if(selectedChat){
               const chatUsers = selectedChat.users;
               const anotherUser = chatUsers.find(users=>user._id !== users._id );
               const anotherUserId = anotherUser._id;
               if(userOnline.usersOnline[anotherUserId] === true) {
                isOnline(true);
               }else{
                isOnline(false);
               }
            }

        
    },[selectedChat,userOnline])


    const fetchAllMessages = async () => {
        
        if (!selectedChat) {
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`api/message/get-all-messages/${selectedChat._id}`, config);
            setMessages(data);
            setLoading(false);
            socketsRef.current.emit("join chat",selectedChat._id);
        } catch (error) {
            console.log(error);
            toast({
                title: "Error Occurred!",
                description: "Error while fetching messages",
                status: "error",
                position: "top",
                isClosable: true,
                duration: 5000,
            });
        }
    };




    useEffect(() => {
        fetchAllMessages();
        selectedChatCompareRef.current = selectedChat;
        
    }, [selectedChat]);
    
    useEffect(()=>{
        
        socketsRef.current.on("message recieved",(newMessageRecieved)=>{
            if(!selectedChatCompareRef.current || selectedChatCompareRef.current._id !== newMessageRecieved.chat._id){
                // give notification
                if(!notifiaction.includes(newMessageRecieved)){
                    setNotifications([newMessageRecieved, ...notifiaction]);
                    sound.play();
                    setFetchChatsAgain(!fetChatsAgain);
                    
                }

            }else{
                
                setMessages([...messages,newMessageRecieved]);
            }
        })
        
    })






    const sendMessage = async (event) => {
        if (event.key === 'Backspace' || event.key === 'backspace') {
            socketsRef.current.emit("stop typing",selectedChat._id);
            // Your code here
        }
        if (event.key === "Enter" && newMessage) {
            socketsRef.current.emit("stop typing",selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post('api/message/new-message', {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config);
               
                setMessages([...messages, data]);
                setLoading(false);
                socketsRef.current.emit("new message",data)
                
            } catch (err) {
                console.log(err);
                toast({
                    title: "Error Occurred!",
                    description: "Error while sending message",
                    status: "error",
                    position: "top",
                    isClosable: true,
                    duration: 5000,
                });
            }
        }
    };


    const handleVisibilityChange = () => {
        if (document.hidden) {
            console.log("tab hidden");
          if (userOnline && userOnline.usersOnline && user && user._id) {
            console.log(userOnline.usersOnline[user._id]);
            // Handle the user being offline
          } else {
            console.log("User data not available");
          }
        } else {
          // Handle the user being online
        }
      };
      
      // Add event listener for visibility change
      document.addEventListener("visibilitychange", handleVisibilityChange);
      

    
    


    const typingHandler = (e) => {
        setNewMessage(e);

        
        

        // Typing indicator logic
        if(!socketConnected){
            return;
        }
        if(!typing){
            setTyping(true);
            socketsRef.current.emit('typing',selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(()=> {
            var time = new Date().getTime();
            var timeDiff = time - lastTypingTime;
            if(time>=timeDiff && typing){
                socketsRef.current.emit('stop typing',selectedChat._id);
                setTyping(false);
            }
        },timerLength)

    };


    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        display={"flex"}
                        justifyContent={{ base: "space-between" }}
                        alignItems={"center"}
                        fontFamily={"Wrok sans"}
                        w={"100%"}
                        px={2}
                        pb={3}
                        fontSize={{ base: "28px", md: "30px" }}
                    >
                        <IconButton display={{ base: "flex", md: "none" }} icon={<ArrowBackIcon />} onClick={() => setSelectedChat("")} />
                        {selectedChat && !selectedChat.isGroupChat ? (
                            <>

                                <Text fontFamily={"Work sans"}> {getSender(user, selectedChat.users)}  </Text>
                                <Text fontFamily={"Work sans"} color='dark-green'> {online ? "Online" : <></>}  </Text>
                                <ProfileModal user={{ user: getFullSender(user, selectedChat.users) }} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal fetChatsAgain={fetChatsAgain} setFetchChatsAgain={setFetchChatsAgain} fetchAllMessages={fetchAllMessages} />
                            </>
                        )}
                    </Text>
                    <Box
                        display={"flex"}
                        flexDir={"column"}
                        justifyContent={"flex-end"}
                        p={3}
                        bg={"#E8E8E8"}
                        w={"100%"}
                        h={"100%"}
                        borderRadius={"lg"}
                        overflowY={"hidden"}
                    >
                        {loading ? (
                            <Spinner size={"xl"} w={20} h={20} alignSelf={"center"} margin={"auto"} />
                        ) : (
                            <>
                                <div className='messages'>
                                    <ScroolableChat messages={messages} />
                                </div>
                            </>
                        )}

                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                            {isTyping ? 
                            (
                            <div>
                                typing...
                                <Lottie 
                                options={defaultOptions}
                                width={70} style={{marginBottom:15 , marginLeft:0}}/>
                            </div>
                            ) 
                            : (<></>)}
                     
                            <InputEmoji fontSize="18px"  variant={"filled"} bg={"#E0E0E0"} value={newMessage} onChange={typingHandler} />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} h={"100%"}>
                    <Text fontSize={"3xl"} pb={3} fontFamily={"Work Sans"} >Click on a user to start chatting</Text>
                </Box>
            )}
        </>
    );
}

export default SingleChat;
