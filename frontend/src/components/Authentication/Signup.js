import React, { useState } from "react";
import {  Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import axios from "axios";
import { useNavigate } from "react-router-dom";
const SignUp = () => {
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [show,setShow] = useState(false);
    const [pic,setPic] = useState();
    const [loading,setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const postDetails = (pic) => {
        setLoading(true);
        if(pic === undefined){
            toast({
                title:"Please select and image",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top-right"

            });
            return;
        }
        const data = new FormData();
        data.append("file",pic);
        data.append("upload_preset","chat-app");
        data.append("cloud_name","dk9nyv0iq");
        fetch("https://api.cloudinary.com/v1_1/dk9nyv0iq/upload",{
            method:"POST",
            body:data,
            
        }).then((resp) => {console.log(resp); resp.json()} ).then(data => {
            setPic(data.url.toString());
            setLoading(false);
        }).catch((err)=>{
            console.log(err);
            setLoading(false);
        })
    }

    const saveUser = async() => {
        setLoading(true);
        if(!name || !email || !password || !confirmPassword){
            toast({
                title : "Please filed all the fields",
                status : 'warning',
                duration : 5000,
                isClosable : true,
                position : 'top-right'
            })
            setLoading(false);
            return;
        }
        if(password !== confirmPassword){
            toast({
                title : "Password doesn't match",
                status : 'warning',
                duration : 5000,
                isClosable : true,
                position : 'top-right'
            })  ;
            setLoading(false);
            return;
        }
        try{
            const config = {
                headers : {"Content-Type" : "application/json"}
            }
            const result = await axios.post("http://localhost:4000/api/user/",{name,email,password,pic},config);
            toast({
                title : "Regsitration Successful",
                status : 'success',
                duration : 5000,
                isClosable : true,
                position : 'top-right'
            });
            localStorage.setItem("user_info",JSON.stringify(result.data));
            setLoading(false);
            navigate('/chats')
        }catch(err){
            console.log(err);
            toast({
                title : err.response.data.message,
                status : 'error',
                duration : 5000,
                isClosable : true,
                position : 'top-right'
            });
            setLoading(false);
            return;
        }
    }
    const showPassword = () => {
        setShow(!show)
    }
    return (
        <VStack spacing={"5px"}>
            <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder="Enter Name" onChange={(e)=>{setName(e.target.value)}}  value={name} />
            </FormControl>
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder="Enter Email" type="email" onChange={(e)=>{setEmail(e.target.value)}}  value={email} />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                <Input placeholder="Enter Password" type={show ? "text" : "password"} onChange={(e)=>{setPassword(e.target.value)}}  value={password} />
                <InputRightElement width={"4.5rem"}>
                <Button h="1.75rem" size={"sm"} onClick={showPassword}>{show ? "Hide" : "Show"}</Button>
                </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="confirm-password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                <Input placeholder="Enter Confirm Password" type={show ? "text" : "password"} onChange={(e)=>{setConfirmPassword(e.target.value)}}  value={confirmPassword} />
                <InputRightElement width={"4.5rem"}>
                <Button h="1.75rem" size={"sm"} onClick={showPassword}>{show ? "Hide" : "Show"}</Button>
                </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="pic">
                <FormLabel>Upload Picture</FormLabel>
                <Input type="file" p={1.5} accept="image/*" onChange={(e) => postDetails(e.target.files[0])} value={pic} />
            </FormControl>
            <Button colorScheme="blue" width={"100%"} marginTop={"5px"} onClick={saveUser} isLoading={loading}>SignUp</Button>
        </VStack>
    )
}

export default SignUp;
