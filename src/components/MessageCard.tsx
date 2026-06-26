'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

import { Button } from './ui/button'
import { Textarea } from './ui/textarea'

import {
  Trash2,
  Send,
  Sparkles,
  ShieldCheck,
  MessageCircleHeart,
} from 'lucide-react'

import {
  Card,
} from '@/components/ui/card'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { Message } from '@/models/User'

type MessageCardProps = {
  message: Message
  onMessageDelete: (messageId: string) => void
  content: string
  sender?: string
  receiver?: string
  reply?: string
}

const MessageCard = ({
  message,
  onMessageDelete,
  content,
  reply,
}: MessageCardProps) => {
  const { data: session } = useSession()

  const username = session?.user.username

  const [replyText, setReplyText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.post('/api/delete-message', {
        username,
        messageId: message._id,
      })

      if (response.status === 200) {
        onMessageDelete(message._id)
        toast.success('Message deleted successfully')
      }
    } catch (error) {
      toast.error('Failed to delete message')
    }
  }

  const handleReply = async () => {
    try {
      setLoading(true)

    
      await axios.post('/api/send-reply', {
        messageId: message._id,
        reply: replyText,
      })


      toast.success('Reply sent successfully')
      setReplyText('')
    } catch (error) {
      console.log(error)
      toast.error('Failed to send reply')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card
      className="
        group
        overflow-hidden
        border-0
        bg-gradient-to-br
        from-blue-500
        via-violet-500
        to-pink-500
        p-[1px]
        shadow-xl
        hover:shadow-2xl
        hover:scale-[1.01]
        transition-all
        duration-300
      "
    >
      <div className="rounded-2xl bg-white/95 backdrop-blur-md">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-blue-50 via-violet-50 to-pink-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <MessageCircleHeart className="h-6 w-5 text-violet-600" />

            <h3
              className="
                font-bold
                bg-gradient-to-r
                from-blue-600
                via-violet-600
                to-pink-600
                bg-clip-text
                text-transparent
              "
            >
              Anonymous Message
            </h3>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="destructive"
                className="h-8 w-8 rounded-full"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete this message?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* BODY */}
        <div className="space-y-4 p-4">
          {/* MESSAGE BOX */}
          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-violet-100
              bg-gradient-to-br
              from-blue-50
              via-violet-50
              to-pink-50
              p-5
            "
          >
            <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-pink-200/20 blur-2xl" />
            <div className="absolute bottom-0 left-0 h-20 w-20 rounded-full bg-blue-200/20 blur-2xl" />

            <div className="relative z-10">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-600" />

                <span className="text-xs font-semibold uppercase tracking-wider text-violet-700">
                  Secret Message
                </span>
              </div>

              <p className="break-words text-slate-800 text-lg leading-relaxed">
                {content}
              </p>
            </div>
          </div>

          {/* REPLY SECTION */}
          {!message?.reply ? (
            <div className="space-y-3">
              <Textarea
                value={replyText}
                onChange={(e) =>
                  setReplyText(e.target.value)
                }
                maxLength={200}
                placeholder="Write your anonymous reply..."
                className="
                  min-h-[90px]
                  resize-none
                  border-violet-200
                  focus-visible:ring-violet-500
                "
              />

              <div className="flex items-center justify-between">
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    bg-gradient-to-r
                    from-blue-100
                    via-violet-100
                    to-pink-100
                    px-3
                    py-1
                  "
                >
                  <ShieldCheck className="h-4 w-4 text-violet-600" />

                  <span className="text-xs font-medium text-violet-700">
                    Anonymous Mode Active
                  </span>
                </div>

                <span className="text-xs text-slate-400">
                  {replyText.length}/200
                </span>
              </div>

              <Button
                disabled={!replyText.trim() || loading}
                onClick={handleReply}
                className="
                  w-full
                  rounded-xl
                  bg-gradient-to-r
                  from-blue-600
                  via-violet-600
                  to-pink-600
                  text-white
                  hover:opacity-90
                  shadow-lg
                  shadow-violet-500/20
                "
              >
                <Send className="mr-2 h-4 w-4" />

                {loading
                  ? 'Sending...'
                  : 'Send Anonymous Reply'}
              </Button>
            </div>
          ) : (
            <div
              className="
                rounded-2xl
                border
                border-emerald-200
                bg-gradient-to-r
                from-emerald-50
                to-green-50
                p-4
              "
            >
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600" />

                <span className="text-sm font-semibold text-emerald-700">
                  Reply Sent Successfully
                </span>
              </div>

              <p className="text-slate-700">
                {reply}
              </p>
            </div>
          )}

          {/* FOOTER */}
          <div className="flex items-center justify-between border-t pt-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />

              <span className="text-xs text-slate-500">
                Anonymous Identity Protected
              </span>
            </div>

            <div className="flex items-center justify-between border-t pt-2">
              <span className="text-[11px] text-slate-500">
                👻 Identity Protected
              </span>

              <span
                className="
      rounded-full
      bg-gradient-to-r
      from-blue-100
      via-violet-100
      to-pink-100
      px-2.5
      py-1
      text-[11px]
      font-medium
      text-violet-700
    "
              >
                MysteryMessage
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default MessageCard