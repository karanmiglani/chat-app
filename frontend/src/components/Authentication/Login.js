import React, { useState } from "react";
import {  Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Login = () => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [show,setShow] = useState(false);
    const [loading , setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const login = async () => {
        setLoading(true);
        if(!email || !password){
            toast({
                title : "All fields are required",
                status : 'success',
                duration : 5000,
                isClosable : true,
                position : 'top-right'
            });
            setLoading(false);
            return;
        }
        try {
            const config = {
               headers : {"Content-Type" : "application/json" }
            };
            const result = await axios.post("http://localhost:4000/api/user/login",{email,password},config);
            toast({
                title : "Login Successfully!",
                status : 'success',
                duration : 5000,
                isClosable : true,
                position : 'top-right'
            });
            
            localStorage.setItem("user_info",JSON.stringify(result.data));
            setLoading(false);
            navigate('/chats')
        }catch(err){
            toast({
                title : err,
                status : 'error',
                duration : 5000,
                isClosable : true,
                position : 'top-right'
            }); 
        }
    }
    const showPassword = () => {
        setShow(!show)
    }
    return (
        <VStack spacing={"5px"}>
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input id="email+login" placeholder="Enter Email" type="email" onChange={(e)=>{setEmail(e.target.value)}}  value={email} />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                <Input id="password_login" placeholder="Enter Password" type={show ? "text" : "password"} onChange={(e)=>{setPassword(e.target.value)}} value={password}  />
                <InputRightElement width={"4.5rem"}>
                <Button h="1.75rem" size={"sm"} onClick={showPassword}>{show ? "Hide" : "Show"}</Button>
                </InputRightElement>
                </InputGroup>
            </FormControl>
            
            <Button isLoading={loading} colorScheme="blue" width={"100%"} marginTop={"5px"} onClick={login}>Login</Button>
            <Button colorScheme="red" width={"100%"} marginTop={"5px"} onClick={() => {
                setEmail("guest@example.com");setPassword("123456")
            }}>Get Guest User Credentials</Button>
        </VStack>
    )
}

export default Login;
