// whenever app k andar koii folder banta hai to wo routing me aa jata hau pr () bracket lga k naam likhte hai to wo routing me count nhi hota it just an group of routes

'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import React, { useEffect, useState } from 'react'

import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Form } from "@/components/ui/form"
import { FormField,FormItem,FormLabel,FormControl,FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"

import { FloatingBubble } from '@/components/FloatingBubble';

import { EmojiReaction } from '@/components/EmojiReaction';



function page() {
  const [isSubmitting,setIsSubmitting] = useState(false)
  const router = useRouter()

const form = useForm({
  resolver:zodResolver(signInSchema),
  defaultValues:{
    identifier:'',
    password:''
  }
})


const onSubmit = async (data:z.infer<typeof signInSchema>)=>
{
  
      try {
        const result = await signIn('credentials',{
          redirect:false,
          email:data.identifier,
          password:data.password
        })
        console.log(result)
        if(result?.error){
          toast("login failed. email or password is incorrect")
          console.log(result.error)
        }
        if(result?.url){
          toast("logged in succesful")
          setTimeout(() => {
            router.replace('/dashboard')
          }, 1000);
        }
      } catch (error) {
        console.log(error)
      }
    
   
}

  return (

    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 overflow-hidden relative">
          <FloatingBubble delay={0} duration={6} size="100px" left="10%" top="20%" />
          <FloatingBubble delay={1} duration={8} size="250px" left="60%" top="3%" />
          <FloatingBubble delay={2} duration={7} size="80px" left="15%" top="70%" />
          <FloatingBubble delay={3} duration={9} size="120px" left="85%" top="60%" />
          <FloatingBubble delay={1.5} duration={6.5} size="90px" left="50%" top="80%" />
    
          <EmojiReaction emoji="👀" left="15%" top="15%" delay={0} />
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
          name="identifier"
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
        <Button type="submit">
          SIGN IN
        </Button>
        </form>
        </Form>
        <div className="text-center mt-4">
          <p >
          don't have an account?{' '}
          <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}

export default page

