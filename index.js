import express from "express"
import connectToMongo from './db.js'
import auth from "./routes/auth.js"
import notes from "./routes/notes.js"
import cors from "cors"


const app = express()
connectToMongo()


app.use(express.json())
app.use(cors());



// Available Routes

app.get("/" , (req,res)=>{
    res.send("Hello World!")
})



app.use("/api/auth" , auth)
app.use("/api/notes" , notes)




app.listen(2110 , ()=>{
    console.log("Your Server has been Start at port No. 2110")
})


