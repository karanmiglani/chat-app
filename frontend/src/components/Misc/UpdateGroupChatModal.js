import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    IconButton,
    useToast,
    Box,
    FormControl,
    Input,
    Spinner,
  } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider';
import UserBadge from '../UserAvatar/UserBadge';
import { Form } from 'react-router-dom';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';

function UpdateGroupChatModal({fetChatsAgain , setFetchChatsAgain , fetchAllMessages}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName , setGroupChatName] = useState();
    const [search , setSearch] = useState("");
    const [searchResult , setSearchResult] = useState([]);
    const [loading , setLoading] = useState(false);
    const [renameLoading , setRenameLoading] = useState(false);
    const toast = useToast();
    const {user , selectedChat , setSelectedChat} = ChatState();

    const addUser = async (userToAdd) => {
        if(selectedChat.users.find((u)=>u._id === userToAdd._id)){
            toast({
                title: "Error!",
                description: "User is already in the group",
                status: "error",
                position: "top",
                isClosable: true,
                duration: 5000
            }) 
            return;
        }

        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title: "Warning!",
                description: "Only admins can add someone",
                status: "warning",
                position: "top",
                isClosable: true,
                duration: 5000
            }) 
            return;
        }

        try{
            setLoading(true);
            const config = {

                headers: { Authorization: `Bearer ${user.token}` }
            }

            const {data} = await axios.post("http://localhost:4000/api/chat/add-to-group",{
                chatId : selectedChat._id,
                userId : userToAdd._id
            },config)
            setSelectedChat(data);
            setFetchChatsAgain(!fetChatsAgain);
            setLoading(false);
        }catch(error){
            console.log(error);
            toast({
                title: "Error!",
                description: "Error while adding to group",
                status: "warning",
                position: "top",
                isClosable: true,
                duration: 5000
            }) 
            setLoading(false);
            return;
        }
    }

    const handleRemove =    async (userToremove) => {
        if(selectedChat.groupAdmin._id !== user._id && userToremove._id !== user._id){
            toast({
                title: "Warning!",
                description: "Only admins can remove someone!",
                status: "error",
                position: "top",
                isClosable: true,
                duration: 5000
            })
            return;
        }
        try{
            setLoading(true);
            const config = {

                headers: { Authorization: `Bearer ${user.token}` }
            }
            const {data} = await axios.put("http://localhost:4000/api/chat/remove-from-group",{
                chatId:selectedChat._id,
                userId : userToremove._id
            },config);
            userToremove._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchChatsAgain(!fetChatsAgain);
            fetchAllMessages();
            setLoading(false);
        }catch(error){
            console.log(error);
            toast({
                title: "Error!",
                description: "Error Occoured!",
                status: "error",
                position: "top",
                isClosable: true,
                duration: 5000
            })
        }
    }

    const renameGroupName = async () => {
        if(!groupChatName){
            return;
        }
        try{
            setRenameLoading(true);
            const config = {

                headers: { Authorization: `Bearer ${user.token}` }
            }

            const {data} = await axios.put("http://localhost:4000/api/chat/rename-group",{
                chatId : selectedChat._id,
                chatName : groupChatName
            },config)
            toast({
                title: "Success!",
                description: "Group Name Updated",
                status: "success",
                position: "top",
                isClosable: true,
                duration: 5000
            })
            onClose();
            setSelectedChat(data);
            setFetchChatsAgain(!fetChatsAgain);
            setRenameLoading(false);
        }catch(err){
            toast({
                title: "Error Occured!",
                description: "Failed to rename group name",
                status: "error",
                position: "top",
                isClosable: true,
                duration: 5000
            })
            setRenameLoading(false);
        }
        setGroupChatName(false);

    }

    const searchUser = async (key) => {
        setSearch(key);
        if(!key){
            return;
        }
        try{
            setLoading(true);
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            }
            const {data} = await axios.get(`http://localhost:4000/api/user/all-users?search=${key}`,config);
            console.log(data);
            setSearchResult(data);
            setLoading(false);
        }catch(error){
            toast({
                title: "Error Occured!",
                description: "Failed to get users",
                status: "error",
                position: "top",
                isClosable: true,
                duration: 5000
            })
            setRenameLoading(false);
            setLoading(false);
        }
    }

    const leaveGroup = async () => {
        
    }
    return (
      <>
        <IconButton display={{base:"flex"}} icon={<ViewIcon />} onClick={onOpen} />
  
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontSize={"35px"} fontFamily={"Work Sans"} display={"flex"} justifyContent={"center"}>{selectedChat.chatName}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
             <Box display={"flex"} flexWrap={"wrap"} pb={3} width={"100%"}>
                {
                selectedChat.users.map((u)=>(
                    <UserBadge key={u._id} user={u} handleFunction={()=>handleRemove(u)} />
                )) 
                }
             </Box>
             <FormControl display={"flex"}>
                <Input placeholder='Chat Name' mb={3} value={groupChatName} onChange={(e)=>{setGroupChatName(e.target.value)}} />
                <Button variant={"solid"} colorScheme='teal' ml={1} isLoading={renameLoading} onClick={renameGroupName}>Update</Button>
             </FormControl>
             <FormControl>
                <Input placeholder='Add user to group eg John , Nick etc..' mb={1} onChange={(e) => {searchUser(e.target.value)}} />
             </FormControl>
             {loading ? (<Spinner size={"lg"} />) : (
             searchResult?.map((user)=>(
                <UserListItem key={user._id} user={user} handleFunction={() => addUser(user)} />
             ))
             )
             }
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='red' onClick={()=> {handleRemove (user)}}>
                Leave Group
              </Button>
             
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default UpdateGroupChatModal