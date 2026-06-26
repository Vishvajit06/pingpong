import {
  UserRound,
  MessageCircle,
  Reply,
  Sparkles,
} from "lucide-react";

export default function ReplyCard({content,reply,sender}:{content:string,reply:string,sender:string}) {
  return (
    <div
      className="
      group
      relative
      w-[420px]
      overflow-hidden
      rounded-3xl
      bg-gradient-to-br
      from-pink-100
      via-white
      to-violet-100
      p-[2px]
      transition-all
      duration-500
      hover:-translate-y-2
      hover:scale-[1.02]
      hover:shadow-2xl
      hover:shadow-pink-300/50
    "
    >
      <div
        className="
        rounded-[22px]
        bg-white/90
        backdrop-blur-lg
        p-6
      "
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-gradient-to-br
              from-pink-500
              to-violet-600
              text-white
              transition-transform
              duration-500
              group-hover:rotate-12
            "
            >
              <UserRound size={22} />
            </div>

            <div>
              <p className="text-xs text-gray-500">AnonymousMessage reply</p>
              <h2 className="font-bold text-gray-800">{sender}</h2>
            </div>
          </div>

          <Sparkles
            className="
            text-pink-500
            transition-all
            duration-500
            group-hover:rotate-180
          "
            size={20}
          />
        </div>
        <div
          className="
          mt-6
          rounded-2xl
          bg-pink-50
          p-4
          transition-all
          duration-300
          group-hover:bg-pink-100
        "
        >
          <div className="mb-2 flex items-center gap-2">
            <MessageCircle size={18} className="text-pink-600" />
            <span className="font-semibold text-pink-700">MessageSent</span>
          </div>

          <p className="leading-7 text-gray-700">
            {content}
          </p>
        </div>
        <div
          className="
          mt-5
          rounded-2xl
          border
          border-violet-200
          bg-violet-50
          p-4
          transition-all
          duration-300
          group-hover:border-pink-300
        "
        >
          <div className="mb-2 flex items-center gap-2">
            <Reply size={18} className="text-violet-700" />
            <span className="font-semibold text-violet-700">
            Received Reply
            </span>
          </div>

          <p className="text-gray-700">
            {reply}
          </p>
        </div>
      </div>

      <div
        className="
        pointer-events-none
        absolute
        inset-0
        -z-10
        bg-gradient-to-r
        from-pink-400/20
        via-violet-400/20
        to-pink-400/20
        opacity-0
        blur-2xl
        transition-opacity
        duration-500
        group-hover:opacity-100
      "
      />
    </div>
  );
}