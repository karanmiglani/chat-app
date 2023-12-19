import React, { useState } from 'react';
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
    useToast,
    FormControl,
    Input,
    Box,
  } from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadge from '../UserAvatar/UserBadge';

function GroupChatModal({children}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName , setGroupChatName] =  useState();
    const [selectUsers , setSelectedUsers] =  useState([]);
    const [search , setSearch] = useState();
    const [searchResult , setSearchResult] =  useState([]);
    const [loading,setLoading] = useState(false);
    const toast = useToast();
    
    const {user,chats , setChats} = ChatState();
    
    const searchUser = async (search_key) => {
        setSearch(search_key);
        
        if (!search_key) {
            toast({
                title: "Please enter something to search",
                status: "warning",
                position: "top",
                isClosable: true,
                duration: 5000
            })
            return
        }
        try {
            
            setLoading(true);
            const config = {

                headers: { Authorization: `Bearer ${user.token}` }
            }
            const { data } = await axios.get(`api/user/all-users?search=${search_key}`, config);
           
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

    const handleGroup = (userToAdd) => {
        if(selectUsers.includes(userToAdd)){
            toast({
                title:"User already added",
                status:"warning",
                position:"top",
                duration:5000,
                isClosable:true
            })
            return;
        }
        setSelectedUsers([...selectUsers,userToAdd])
    }

    const handleDelete = (delUser) => {
        setSelectedUsers(selectUsers.filter(sel=>sel._id !== delUser._id));
    }
    const createGroup  = async () => {
        if(!groupChatName || !selectUsers){
            toast({
                title:"All fields are required",
                status:"warning",
                position:"top",
                duration:5000,
                isClosable:true
            })
            return;
        }
        try{
            const config = {

                headers: { Authorization: `Bearer ${user.token}` }
            }

            const {data} =  await axios.post("api/chat/create-group",{
                name : groupChatName,
                users :JSON.stringify(selectUsers.map((u)=>u._id)),
            },config)
            setChats([data,...chats]);
            onClose();
            toast({
                title:"New Group Chat Created",
                status:"success",
                position:"top",
                duration:5000,
                isClosable:true
            })
        }catch(err){
            console.log(err);
            toast({
                title:"Error!",
                description:err.response.data.message,
                status:"error",
                position:"top",
                duration:5000,
                isClosable:true
            })
            return;
        }
    }
    
 return (
    <>
    <span onClick={onOpen}>{children}</span>

    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize={"35px"} fontFamily={"Work sans"} display={"flex"} justifyContent={"space-between"}>Create Group Chat</ModalHeader>
        <ModalCloseButton />
        <ModalBody display={"flex"} flexDirection={"column"} justifyContent={"center"}>
            <FormControl>
                <Input placeholder='Enter Group Name' mb={3}  onChange={(e)=>setGroupChatName(e.target.value)}/>
            </FormControl>

            <FormControl>
                <Input placeholder='Add users eg:John,Nick' mb={1}  onChange={(e)=>{searchUser(e.target.value)}}/>
            </FormControl>
            {/* Selected User */}
            <Box display={"flex"} flexWrap={"wrap"}>

            {selectUsers.map(u => (
                <UserBadge key={u._id} user={u} handleFunction={()=>handleDelete(u)}/>
                ))}
                </Box>
            {/* Render Seached User */}
            {loading ?<div>Loading</div>: (
                searchResult?.slice(0,4).map(user => (
                    <UserListItem key={user._id} user={user} handleFunction={()=>{handleGroup(user)}} />
                ))
            )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={createGroup}>
            Create Group
          </Button>
         
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
 )
}

export default GroupChatModal
