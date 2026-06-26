'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'

import { MessageCircle,  Camera } from 'lucide-react';
import { toast } from 'sonner'
import axios from 'axios'


const Navbar =  () => {

  const { data: session } = useSession()
  const user: User = session?.user as User

  const {update} = useSession()
  async function upload(e:React.ChangeEvent<HTMLInputElement>){

    const file = e.target.files?.[0]
    if(!file){
      toast("no file has been found")
      return
    }
    const formData = new FormData()
    formData.append("image",file)

    try {
      const res = await axios.post("/api/upload-profile-pic",formData)
   
      if(res){
        await update({
          profilePicture:res.data.url
        })
        toast("profile-pic is uploaded")
      }
    } catch (error) {
      toast("failed to upload profile")
      console.log("something went worng during porfile update",error)
    }
  }




  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
              </Link>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                PingPong
              </h1>
            </div>
          </div>

          {/* Nav Links / Buttons */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-gray-700 hidden sm:inline">
                  Welcome, {user?.username || user?.email}
                </span>

                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    id="profile-upload"
                    className="hidden"
                    onChange={upload}
                  />

                  <label
                    htmlFor="profile-upload"
                    className="cursor-pointer block"
                  >
                    <div className="relative w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-[2px] hover:scale-105 transition-transform duration-300">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                        {user?.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Camera className="w-5 h-5 text-purple-600" />
                        )}
                      </div>

                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                        <Camera className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </label>
                </div>

                <button
                  onClick={() => signOut()}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <button
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    Sign In
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>

  )
}

export default Navbar
