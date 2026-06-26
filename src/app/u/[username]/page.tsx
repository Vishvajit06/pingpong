'use client'
import React, { useState, useEffect } from 'react';
import { Send, MessageCircle, Sparkles } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';




function  App({params}:{params:{username:string}}) {
 
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<Array<{content: string, timestamp: Date}>>([]);
  
  const [data,setData]=useState({
    content:""
  })

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.content.trim()) return;
    setIsSending(true);
    const {username} =  params;
  
   await new Promise(resolve=>setTimeout(resolve, 1000));
   const response = await axios.post("/api/send-message",{ 
    username,
    content:data.content,
    }).catch((error:any)=>{
    if(error.response){

      toast(error.response.data.message);
    }
    else if(error.request){
      console.log("no response came back from server")
    }
    else{
      console.log("something went wrong during axios request")
    }
   })
   
   if(response){
     toast(response.data.message)
     
    }
    
    const newMessage = {
      content: data.content.trim(),
      timestamp: new Date(),
      reply:""
    };
    
    setMessages(prev => [...prev, newMessage]);
    setData({...data,content:''});
    setIsSending(false);
    console.log(data)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className={`w-full max-w-md transform transition-all duration-1000 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                PING-pong
              </h1>
              <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
            </div>
            <p className="text-purple-200 text-lg opacity-90">
              Send an anonymous message into the void
            </p>
          </div>

          {/* Message Form */}
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/20 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Message Field */}
              <div className="relative group">
                <label className="block text-purple-200 text-sm font-medium mb-2 transition-colors group-focus-within:text-purple-300">
                  <MessageCircle className="w-4 h-4 inline mr-2" />
                  Message
                </label>
                <textarea
                  value={data.content}
                  onChange={(e) =>setData({...data,content:e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:bg-white/15 resize-none"
                  placeholder="What mysteries do you wish to share..."
                  maxLength={500}
                />
                <div className="text-right text-purple-300 text-xs mt-1">
                  {data.content.length}/500
                </div>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!data.content.trim() || isSending}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                  !data.content.trim() || isSending
                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {isSending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending into the void...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Mystery Message
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>

          {/* Messages Display */}
          {messages.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-semibold text-purple-200 text-center">
                Messages Sent
              </h3>
              <div className="space-y-3">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`backdrop-blur-lg bg-white/5 rounded-xl p-4 border border-white/10 transform transition-all duration-500 ${
                      index === messages.length - 1 ? 'animate-pulse' : ''
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <MessageCircle className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-400 text-xs">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-white/90 leading-relaxed">{msg.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;



