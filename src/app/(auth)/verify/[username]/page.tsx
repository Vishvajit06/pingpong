'use client'
import { verifySchema } from '@/schemas/verifySchema';
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import {useForm} from "react-hook-form"
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/types/apiResponse';
import { FormField, FormItem, FormLabel, FormControl,  FormMessage } from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';


const VerifyUser = () => {


    const [verified,setverified] = useState(false)
    const router = useRouter();
    const params = useParams<{username:string}>()
    const form = useForm<z.infer<typeof verifySchema>>({
      resolver:zodResolver(verifySchema),
    })

    const onSubmit = async(data:z.infer<typeof verifySchema>)=>{
            try {
               const response =  await axios.post('/api/verifyCode',{
                    username:params.username,
                    code:data.code
                })
                toast(response.data.message)
               if(response.data.success) router.replace('/sign-in')
                setverified(response.data.success)
            } catch (error) {
                console.error("cannot verify user. please provide the valid code",error)
                      const axiosError = error as AxiosError<ApiResponse>
                      const message = axiosError.response?.data.message
                      toast(message);
            }
    }



  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            VERIFY YOUR ACCOUNT
          </h1>
          <p className="mb-4">
           enter the code sent to your email
          </p>
           
        </div>
         <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>VERIFICATION CODE</FormLabel>
              <FormControl>
                <Input placeholder="enter your code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
        className='border-m bg-blue-500 hover:bg-blue-700 p-1 rounded cursor-pointer' 
        type="submit">Submit</Button>
      </form>
    </Form>

          <div className='flex justify-center item-center p-2'>
            {verified?(<>
            <h1 className='text-xl bolder text-green-500'>SUCESSFULLY VERIFIED PLEASE SIGN IN</h1>
            </>):(<></>)}
          </div>
          
        </div>
        </div>
  )
}

export default VerifyUser;


