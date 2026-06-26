'use client'
import { Message, User } from '@/models/User'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import MessageCard from '@/components/MessageCard'
import {  Loader2, RefreshCcw } from 'lucide-react'
import { getPusherClient } from '@/lib/pusherClient'
import { UserCard } from '@/components/userCard'
import ReplyCard from '@/components/ReplyCard'


const Page = () => {
  const [replies,setReplies] = useState([])
  const [message, setMessage] = useState<Message[]>([])
  console.log(message)
  const [isLoading, setLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [activeSection, setActiveSection] = useState<
    "received" | "replies" | "discover"
  >("received");
  const [searchUsername, setSearchUsername] = useState("");
  const [users, setUsers] = useState<any[]>([]);

  const handleDeleteMessage = async (messageId: string) => {
    setMessage(message.filter((prevMesssage) => (prevMesssage._id !== messageId)))
  }
  const { data: session } = useSession()
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })
  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages')


  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessage ?? false)

    } catch (error) {
      const axoisError = error as AxiosError<ApiResponse>
      toast(axoisError.response?.data.message || "failed to fetch accepting message status")
    } finally {
      setIsSwitchLoading(false)
    }

  }, [setValue])

  const fetchMessage = useCallback(async (refresh: boolean = false) => {
    setLoading(true)
    try {

      const [response,reply] = await Promise.all([axios.get('/api/get-messages'),axios.get("/api/get-reply")])

      setReplies(reply.data?.data || [])
      setMessage(response.data?.messages || [])
      if (refresh) {
        toast("showing latest messages and replies")
      }

    } catch (error) {
      const axoisError = error as AxiosError<ApiResponse>
      toast(axoisError.response?.data.message || "failed to fetch  message status")
    } finally {
      setLoading
        (false)
    }
  }, [setLoading, setMessage])

  useEffect(() => {
    if (!session || !session.user) return
    fetchMessage();
    fetchAcceptMessages();

  }, [session, setValue, fetchAcceptMessages, fetchMessage])

  useEffect(()=>{
    if(!session || !session.user) return;
    const pusher = getPusherClient();

    const channel = pusher.subscribe(`user-${session.user._id}`);

    channel.bind(
      "new-message",
      (data:any)=>{
        toast(data.title);
      }
    )

    channel.bind("new-reply",(data:any)=>{
        toast(data.title)
    })

        return ()=>{

        channel.unbind_all();

        pusher.unsubscribe(
            `user-${session.user._id}`
        );

    };


  },[session])


  async function searchUser(){
    console.log(searchUsername)
      const res = await axios.post('api/search-user',{username:searchUsername})
      setUsers(res.data.data)
      console.log(res);
  }


  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessages', !acceptMessages)
      toast(response.data.message)

    } catch (error) {
      const axoisError = error as AxiosError<ApiResponse>
      toast(axoisError.response?.data.message || "failed to alter messageAccepting status")
    }
  }


  if (!session || !session.user) {
    return (
      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-pink-500
        via-purple-500
        to-blue-500
        p-6
      "
      >
        <div
          className="
          w-full
          max-w-md
          rounded-3xl
          border
          border-white/20
          bg-white/10
          backdrop-blur-xl
          shadow-2xl
          p-8
          text-center
          text-white
        "
        >
          {/* ICON */}
          <div
            className="
            mx-auto
            mb-6
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-full
            bg-white/20
            text-4xl
          "
          >
            🔒
          </div>
          <h1 className="text-3xl font-bold">
            Please Login
          </h1>

          <p className="mt-4 text-sm leading-6 text-white/80">
            You need to login first to continue
            using the app and access your mystery
            messages.
          </p>
        </div>
      </div>
    )
  }


  const { username } = session.user as User;

  // window.location.protocol it gives http or https.  window.location.host gives host ie localhost or vercel host or anywhere 
  // building url 
  const baseUrl = `${window.location.protocol}//${window.location.host}`;

  // here we are adding the username in the url to complete the url
  const profileUrl = `${baseUrl}/u/${username}`;


  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast('Profile URL has been copied to clipboard.',);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-violet-50 to-pink-50">
      <div className="mx-auto max-w-7xl px-4 py-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">
            User Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your anonymous messages and replies.
          </p>
        </div>

   

        <div className="grid gap-6 md:grid-cols-2 mb-8">

          {/* PROFILE LINK */}
          <div className="rounded-2xl bg-white shadow-lg border border-slate-100 p-5">
            <h2 className="font-semibold text-lg mb-3">
              🔗 Share Your Link
            </h2>

            <div className="flex gap-2">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="
              flex-1
              rounded-lg
              border
              border-slate-200
              bg-slate-50
              px-3
              py-2
              text-sm
            "
              />

              <Button
                onClick={copyToClipboard}
                className="
              bg-gradient-to-r
              from-blue-600
              via-violet-600
              to-pink-600
              cursor-pointer
            "
              >
                Copy
              </Button>
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-lg border border-slate-100 p-5">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="font-semibold text-lg">
                  📩 Accept Messages
                </h2>

                <p className="text-sm text-slate-500">
                  Control whether users can send messages.
                </p>
              </div>

              <Switch
                {...register('acceptMessages')}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
              />
            </div>

            <div className="mt-4">
              <span
                className={`text-sm font-medium ${acceptMessages
                    ? "text-green-600"
                    : "text-red-500"
                  }`}
              >
                {acceptMessages
                  ? "🟢 Incoming Messages Enabled"
                  : "🔴 Incoming Messages Disabled"}
              </span>
            </div>

          </div>

        </div>

        <div className="mb-8 flex justify-center">

          <div className="flex rounded-2xl bg-white p-1 shadow-lg border">

            <Button
              onClick={() => setActiveSection("received")}
              className={
                activeSection === "received"
                  ? `
                bg-gradient-to-r
                from-blue-600
                via-violet-600
                to-pink-600
                text-white
              `
                  : `
                bg-transparent
                text-slate-600
                hover:bg-slate-100
              `
              }
            >
              📥 Received Messages
            </Button>

            <Button
              onClick={() => setActiveSection("replies")}
              className={
                activeSection === "replies"
                  ? `
                bg-gradient-to-r
                from-blue-600
                via-violet-600
                to-pink-600
                text-white
              `
                  : `
                bg-transparent
                text-slate-600
                hover:bg-slate-100
              `
              }
            >
              💬 Replies Received
            </Button>

            <Button
              onClick={() => setActiveSection("discover")}
              className={
                activeSection === "discover"
                  ? `
        bg-gradient-to-r
        from-blue-600
        via-violet-600
        to-pink-600
        text-white
      `
                  : `
        bg-transparent
        text-slate-600
        hover:bg-slate-100
      `
              }
            >
              🔍 Discover People
            </Button>

          </div>

        </div>

        {activeSection === "received" && (
          <div>

            <div className="flex items-center justify-between mb-5">

              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  📥 Inbox Messages
                </h2>

                <p className="text-sm text-slate-500">
                  Anonymous messages sent to you.
                </p>
              </div>

              <Button
                className='cursor-pointer'
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  fetchMessage(true);
                }}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
              </Button>

            </div>

            {message.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                {message.map((message) => (
                  <MessageCard
                    key={message._id}
                    message={message}
                    onMessageDelete={handleDeleteMessage}
                    content={message.content}
                    reply={message.reply}
                  />
                ))}

              </div>
            ) : (
              <div className="rounded-2xl bg-white p-8 text-center shadow-md">
                <p className="text-slate-500">
                  No messages to display.
                </p>
              </div>
            )}

          </div>
        )}

        {activeSection === "replies" && (
          <div>

            <div className="mb-5">
              <h2 className="text-2xl font-bold text-slate-800">
                💬 Replies Received
              </h2>

              <p className="text-sm text-slate-500">
                Replies on messages you have sent.
              </p>
            </div>

            {replies.length>0 ? 
            (<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
             {replies.map((reply:any,index)=>(
              <ReplyCard 
                key={index}
                content={reply.content}
                sender={reply.receiverId.username}
                reply={reply.reply}
              >

              </ReplyCard>
              ))}
            </div>)
            :( 
            <div className="rounded-2xl bg-white p-10 shadow-md text-center">

              <div className="text-5xl mb-4">
                👻
              </div>

              <h3 className="text-lg font-semibold text-slate-700">
                No Replies Yet
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                When someone replies to a message you sent,
                it will appear here.
              </p>
            </div>
            )}

           

          </div>
        )}

        {activeSection === "discover" && (
          <div>

            <div className="mb-5">
              <h2 className="text-2xl font-bold text-slate-800">
                🔍 Discover People
              </h2>

              <p className="text-sm text-slate-500">
                Search users by username.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg">

              <div className="flex flex-col md:flex-row gap-3">

                <input
                  type="text"
                  placeholder="Search username..."
                  value={searchUsername}
                  onChange={(e) =>
                    setSearchUsername(e.target.value)
                  }
                  className="
            flex-1
            rounded-xl
            border
            border-slate-200
            px-4
            py-3
            outline-none
            focus:border-violet-400
          "
                />

                <Button 
                  onClick={searchUser}
                  className="
            bg-gradient-to-r
            from-blue-600
            via-violet-600
            to-pink-600
            p-3
            h-12
            cursor-pointer
          "
                >
                  Search
                </Button>

              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
               

                {users.length > 0 ? (
                  users.map((user, index) => (

                  <UserCard 
                    key={index}
                    profilePicture={user.profilePicture}
                    username={user.username}
                    />

                    
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">

                    <div className="text-5xl mb-3">
                      🔍
                    </div>

                    <h3 className="font-semibold text-slate-700">
                      Search Users
                    </h3>

                    <p className="text-sm text-slate-500 mt-2">
                      Search by username to discover active users.
                    </p>

                  </div>
                )}

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Page
