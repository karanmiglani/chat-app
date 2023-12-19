import { ViewIcon } from "@chakra-ui/icons";
import { Button, FormControl, FormLabel, IconButton, Image, Input, Spinner, Text, useDisclosure, useToast } from "@chakra-ui/react";
import React from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
import { useState } from "react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";


const ProfileModal = ({user,children}) => {
  const oldUser = ChatState().user;
  const {setUser} = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [newPic ,setNewPic] = useState();
    const [loading ,setNewLoading] = useState(false);
    const toast = useToast();
    const handleUpdatePic = (e) => {
      setNewPic(e.target.files[0]);
    }

    const updatePic = async () => {
      if(newPic === undefined){
        toast({
          title : "Please select an image",
          status : "warning",
          duration : 5000,
          isClosable : true,
          position : "top"
        })
        return;
      }
      setNewLoading(true);
      const newdata = new FormData();
      newdata.append("file",newPic);
      newdata.append("upload_preset","chat-app")
      newdata.append("cloud_name","dk9nyv0iq");
      let result = await fetch ("https://api.cloudinary.com/v1_1/dk9nyv0iq/upload",{
        method : "POST",
        body : newdata
      })
      result = await result.json();
      const url = result.url;
      const config = {
        headers : {
          "Content-Type" : "application/json",
          Authorization : `Bearer ${user.user.token}`
        }
      }
      const {data} = await axios.put("api/user/update-pic",{url:url},config);
      setUser({...oldUser,...data});
      setNewLoading(false);
      onClose();
      toast({
        title : "Profile Pic Updated!",
        status : "success",
        duration : 5000,
        isClosable : true,
        position : "top"
      })
      
    }
    return <>
    {
        children ? (<span onClick={onOpen}>{children}</span>)
        :
        (<IconButton display={"flex"} icon={<ViewIcon />} onClick={onOpen} />)
    }
     <Modal size={"xl"}   isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent height={"500px"}>
          <ModalHeader
          fontSize={"4xl"}
          fontFamily={"Work sans"}
          display={"flex"}
          justifyContent={"center"}
          >{user.user.email}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"} justifyContent={"space-between"}>
        
           <Image
           borderRadius={"full"}
           boxSize={"100px"}
           src={user.user.pic}
           alt={user.user.pic}
          ></Image>
          
          <Text fontSize={{base:"28px",md:"30px"}}  fontFamily={"Work sans"}>{user.user.name}</Text>
          <FormControl>
            <FormLabel>Update Profile Pic</FormLabel>
            <Input type="file"  accept="image/*" p={1.5} onChange={handleUpdatePic} />
            </FormControl>
         {
          !loading ?  <Button  colorScheme="green" onClick={updatePic} >Update</Button> : (
            <Spinner />
          )
         }
         
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
           
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>

}

export default ProfileModal;
