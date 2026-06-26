import mongoose from "mongoose"


type connectionObject ={
    isConnected?:number
}

const connection:connectionObject={}

export async function dbConnect():Promise<void>{
    // since nextjs run on edge so dbconnection at regular interval required but some db calls are very frequent so baar baar connect krne se phle hm dekh lete hai phe se connection hai ya nhi agar hai to do call db again just utilize it
    if(connection.isConnected){
        console.log("database already connected")
        return
    }
    try {
       const db = await mongoose.connect(process.env.MONGO_DB_URI || '',{})

       connection.isConnected=db.connections[0].readyState

       console.log("db connected sucessfuly")



    } catch (error) {

        console.log("db cinnectuin failed",error)
        process.exit()
    }
}