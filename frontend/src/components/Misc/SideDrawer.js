import {
    Avatar, Box, Button, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip,

    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Input,
    useDisclosure,
    useToast,
    Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";

const SideDrawer = () => {
    const user = ChatState();
    const {setSelectedChat , notifiaction , setNotifications} = ChatState();
    const { chats, setChats } = ChatState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const btnRef = React.useRef()
    const navigate = useNavigate();
    const logoutHandler = () => {
        localStorage.removeItem("user_info");
        navigate('/', { replace: true }, () => {
            // Code to execute after navigation
            window.location.reload(); // Reload the page
          });
    }

    

    const searchUser = async () => {
        if (!search) {
            toast({
                title: "Please enter something to search",
                status: "warning",
                position: "top",
                isClosable: true,
                duration: 5000
            })
        }
        try {
            setLoading(true);
            const config = {

                headers: { Authorization: `Bearer ${user.user.token}` }
            }
            const { data } = await axios.get(`api/user/all-users?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);

        } catch (err) {
            toast({
                title: "Error Occured!",
                description: "Failed to load search results",
                status: "error",
                position: "top",
                isClosable: true,
                duration: 5000
            })
        }
    }


    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {

                headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.user.token}` }
            }

            const { data } = await axios.post(`api/chat`, { userId }, config);
            
            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats]);
            }
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
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

    return (
        <>
            <Box
                display={"flex"}
                justifyContent={"space-between"}
                bg={"white"}
                w={"100%"}
                p={"5px 10px 5px 10px"}
                borderWidth={"5px"}
                borderColor={"skyblue"}
            >
                <Tooltip label="Search user to chat" hasArrow placement="bottom-end">
                    <Button variant={"ghost"} ref={btnRef} onClick={onOpen}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <Text display={{ base: "none", md: "flex" }} px={4}>Search User</Text>
                    </Button>
                </Tooltip>
                <Text fontSize={"2xl"} fontFamily={"Work Sans"}>Talk-A-Tive</Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon fontSize={"2xl"} m={1} />
                        </MenuButton>
                        <MenuList paddingLeft={2}>
                            {!notifiaction.length && "Now new messages"}
                            {notifiaction.map((notify)=>{return(
                                <MenuItem key={notify._id} onClick={()=> {
                                    setSelectedChat(notify.chat);
                                    setNotifications(notifiaction.filter((n)=> n !== notify));
                                }}>
                                    {notify.chat.iGroupChat?`New Message in ${notifiaction.chat.chatName}`:`New Message from ${getSender(user.user,notify.chat.users)}`}
                                </MenuItem>
                            )})}
                        </MenuList>
                    </Menu>

                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size={"sm"} cursor={"pointer"} name={user.user.name} src={user.user.pic}

                            />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth={"1px"}>Search</DrawerHeader>

                    <DrawerBody>
                        <Box
                            display={"flex"}
                            paddingBottom={2}
                        >
                            <Input
                                placeholder="Search by email or name..."
                                marginRight={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={searchUser}>Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            <>
                                {searchResult.length === 0 ? (
                                    <Text>No users found</Text>
                                ) : (
                                    searchResult.map((user) => {
                                      
                                        return (
                                            <UserListItem
                                                key={user._id}
                                                user={user}
                                                handleFunction={() => accessChat(user._id)}
                                            />
                                        );
                                    })
                                )}

                            </>
                        )}
                        {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
                    </DrawerBody>



                </DrawerContent>
            </Drawer>
        </>

    )
}

export default SideDrawer;
