'use client';


import Link from 'next/link';

import { Mail } from 'lucide-react'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';
import { useEffect,useState } from 'react';

import { MessageCircle, Shield, Zap, Users } from 'lucide-react';
import { FloatingBubble } from '@/components/FloatingBubble';
import { FeatureCard } from '@/components/FeatureCard';
import { EmojiReaction } from '@/components/EmojiReaction';

import {
  Carousel,
  CarouselContent,
  CarouselItem,

} from '@/components/ui/carousel';


export default function Home() {
   const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  return (
    <>
      {/* Main content */}
          <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 overflow-hidden relative">
      <FloatingBubble delay={0} duration={6} size="100px" left="10%" top="20%" />
      <FloatingBubble delay={1} duration={8} size="150px" left="80%" top="10%" />
      <FloatingBubble delay={2} duration={7} size="80px" left="15%" top="70%" />
      <FloatingBubble delay={3} duration={9} size="120px" left="85%" top="60%" />
      <FloatingBubble delay={1.5} duration={6.5} size="90px" left="50%" top="80%" />

      <EmojiReaction emoji="👀" left="15%" top="15%" delay={0} />
      <EmojiReaction emoji="💬" left="85%" top="25%" delay={0.5} />
      <EmojiReaction emoji="❤️" left="10%" top="60%" delay={1} />
      <EmojiReaction emoji="💀" left="90%" top="70%" delay={1.5} />
      <EmojiReaction emoji="🔥" left="20%" top="85%" delay={2} />
      <EmojiReaction emoji="✨" left="75%" top="80%" delay={2.5} />

    <main className="container mx-auto px-6">
          <section
            className={`text-center py-20 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="inline-block mb-6 px-6 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-white/30">
              <span className="text-purple-600 font-semibold">Anonymous Message Arena</span>
            </div>

            <h2 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-500 bg-clip-text text-transparent leading-tight">
              Say Anything,
              <br />
              Stay Anonymous
            </h2>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Drop messages, spark conversations, and vibe with the community – all without revealing who you are.
            </p>

            <Link href="/sign-in">
            <button
              className="group relative px-12 py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white text-xl font-bold rounded-full hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 transition-all duration-300"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
            </button>
            </Link>
          </section>

          <section className={`py-20 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="text-center mb-16">
              <h3 className="text-5xl font-bold mb-4 text-gray-800">Why PingPong?</h3>
              <p className="text-xl text-gray-600">Freedom to express, safety to explore</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={MessageCircle}
                title="Anonymous Chat"
                description="Share your thoughts freely without the pressure of identity"
                gradient="from-purple-500 to-purple-600"
              />
              <FeatureCard
                icon={Shield}
                title="Safe Space"
                description="Protected environment with community guidelines and moderation"
                gradient="from-pink-500 to-pink-600"
              />
              <FeatureCard
                icon={Zap}
                title="Real-time Fun"
                description="Instant messages, quick reactions, and live interactions"
                gradient="from-blue-500 to-cyan-500"
              />
              <FeatureCard
                icon={Users}
                title="Active Community"
                description="Join thousands vibing and sharing authentic conversations"
                gradient="from-purple-500 to-pink-500"
              />
            </div>
          </section>

          <section className={`py-20 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-[3rem] blur-3xl opacity-20" />
              <div className="relative bg-white/40 backdrop-blur-xl rounded-[3rem] p-12 md:p-20 border border-white/20 text-center">
                <h3 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Ready to Ping?
                </h3>
                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                  Join the arena where every message matters and every voice counts – all while staying completely anonymous.
                </p>
                <Link href="/sign-in">
                <button
                  className="px-12 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-full hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 transition-all duration-300"
                >
                  Jump In Now
                </button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <footer className="container mx-auto px-6 py-12 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              PingPong
            </span>
          </div>
          <p className="text-gray-500">Your anonymous message arena</p>
        </footer>
        </div>

      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>

        {/* Carousel for Messages */}
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2023 True Feedback. All rights reserved.
      </footer>
    </>
  );
}
