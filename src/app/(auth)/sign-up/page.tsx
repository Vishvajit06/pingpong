// whenever app k andar koii folder banta hai to wo routing me aa jata hau pr () bracket lga k naam likhte hai to wo routing me count nhi hota it just an group of routes

'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import React, { useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/apiResponse"
import { Form } from "@/components/ui/form"
import { FormField,FormItem,FormLabel,FormControl,FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {Loader2} from "lucide-react"


import { FloatingBubble } from '@/components/FloatingBubble';

import { EmojiReaction } from '@/components/EmojiReaction';


function Page() {
  const [username,setUsername]= useState('')
  const [usernameMessage,setUsernameMessage]=useState('')
  const [isCheakingUsername,setIsCheakingUsername]=useState(false)
  const [isSubmitting,setIsSubmitting]=useState(false)
  const router = useRouter()
  const debounced = useDebounceCallback(setUsername,400)

// zod implementation
const form = useForm({
  resolver:zodResolver(signUpSchema),
  defaultValues:{
    username:'',
    email:'',
    password:''
  }
})

useEffect(()=>{
    const checkUsernameUnique = async ()=>{
      if (username){
        setIsCheakingUsername(true)
        setUsernameMessage('')
        try {
          
       const res =  await axios.get(`/api/check-username-unique?username=${username}`)
          setUsernameMessage(res.data.message)
          console.log(username)
          
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
        setUsernameMessage(axiosError.response?.data.message || 'Error checking username');
    
        } finally{
          setIsCheakingUsername(false)
        }
    
      }
    }
        checkUsernameUnique();
    
},[username])

const onSubmit = async (data:z.infer<typeof signUpSchema>)=>
  {
    setIsSubmitting(true);
    try {
     const response =  await axios.post<ApiResponse>('/api/signup',data)
     toast(response.data.message)
     router.replace(`/verify/${username}`)
     setIsSubmitting(false)
     console.log(response)
    } catch (error) {
      console.error("error during sign-up user",error)
      const axiosError = error as AxiosError<ApiResponse>
      const message = axiosError.response?.data.message
      toast(message);
      setIsSubmitting(false)
    }

}

  return (

     <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 overflow-hidden relative">
              <FloatingBubble delay={0} duration={6} size="100px" left="20%" top="20%" />
              {/* <FloatingBubble delay={1} duration={8} size="250px" left="60%" top="3%" /> */}
              <FloatingBubble delay={2} duration={7} size="80px" left="15%" top="70%" />
              <FloatingBubble delay={3} duration={9} size="120px" left="85%" top="60%" />
            
        
              <EmojiReaction emoji="👀" left="15%" top="20%" delay={0} />
              <EmojiReaction emoji="💬" left="85%" top="25%" delay={0.5} />
              <EmojiReaction emoji="❤️" left="10%" top="60%" delay={1} />
              <EmojiReaction emoji="💀" left="90%" top="70%" delay={1.5} />
              <EmojiReaction emoji="👿" left="20%" top="85%" delay={2} />
              <EmojiReaction emoji="✨🧚‍♀️" left="75%" top="80%" delay={2.5} />
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">
            Sign up to start your anonymous adventure
          </p>
        </div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6"> 
          <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} 
                onChange={(e)=>{
                  field.onChange(e)
                  debounced(e.target.value)
                }}
                />
              </FormControl>
              {isCheakingUsername && <Loader2 className="animate-spin"/>}
              <p className={`text-sm ${usernameMessage==="username is unique" ? 'text-green-500' : 'text-red-500'}`}>
                test {usernameMessage}
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {
            isSubmitting ? (
              <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> please wait
              </>
            ):("SIGN UP")
          }
        </Button>
        </form>
        </Form>
        <div className="text-center mt-4">
          <p >
          Already A Member ?{' '}
          <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Page

