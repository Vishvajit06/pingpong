'use client'

import { toast } from 'sonner'
import { User ,Link2 } from 'lucide-react'



export const UserCard = ({profilePicture,username}:{profilePicture:string,username:string})=>{

    const baseurl = `${window.location.protocol}//${window.location.host}`

    const url = `${baseurl}/u/${username}`

    function copy(){
        navigator.clipboard.writeText(url)
        toast('Profile URL has been copied to clipboard.',);
    }


    return (
    <div className="group relative w-80 overflow-hidden rounded-3xl border border-gray-200/70 bg-violet-100 p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

        {/* Top Accent */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500" />

        {/* Avatar */}
        <div className="flex justify-center">
            <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 opacity-80 blur-sm transition-all duration-300 group-hover:opacity-100" />

                <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100">
                    {profilePicture ? (
                        <img
                            src={profilePicture}
                            alt={username}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <User className="h-16 w-16 text-gray-400" />
                    )}
                </div>
            </div>
        </div>

        {/* User Info */}
        <div className="mt-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {username}
            </h1>

            <p className="mt-2 text-sm text-gray-500 truncate">
                {url}
            </p>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Copy Button */}
        <button
            onClick={copy}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-black hover:scale-[1.02] active:scale-95"
        >
            <Link2 className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
            Copy Profile Link
        </button>
    </div>
)
}

// export function userCard(ProfilPicture:string,username:string){
// return (
//     <>
//        <div className="w-80 rounded-2xl bg-pink-100 shadow-lg p-6 flex flex-col items-center cursor-pointer  transition-all duration:200 ease-in hover:scale-105 hover:rotate-1 hover:shadow-2xl hover:shadow-pink-300 hover:[transform:translateZ(60px)] overflow-hidden ">

//     <div className="h-36 w-36 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-medium text-sm overflow-hidden flip-y">
//       <img src={ProfilPicture} alt="https://www.mamp.one/wp-content/uploads/2024/09/image-resources2.jpg" className=' h-full w-full object-cover rounded-full' />
//     </div>


//     <h1 className="mt-4 text-2xl font-semibold text-gray-800">
//       Username
//     </h1>


//     <button className="mt-6 w-full rounded-lg bg-pink-600 py-2 text-white font-medium transition hover:bg-pink-700 active:scale-95">
//       Copy Link
//     </button>

//   </div>


//     </>
// )
// }