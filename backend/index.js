require('dotenv').config()

//connecting with supabase
const { createClient } = require('@supabase/supabase-js')

//creating supabase client instance
const supabase=createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
console.log('success') //print success in case of sucessfull connection b/w node js and supabase

//initialise express
const express=require('express')
const app=express()

//importing multer to upload files
const multer=require("multer")


//temporay memory storage
//uploaded file will be kept in ram instead of storing to disk since it will be sent to supabase later
const storage=multer.memoryStorage()

//a middleware that will intercept the request and make the uploaded file available as req.file
const upload=multer({storage:storage})

const PORT=process.env.port || 5000

//defining a post route at upload
app.post('/upload', upload.single('file'),async(req,res)=>{
   
    const file=req.file //req.file contains details about the file name,size,etc.
    console.log(file)
    if(!file){
        return res.status(400).json({error: "No file uploaded"}) //incase no file is uploaded

    }
    res.status(200).json({
        message: "file uploaded successfully",
    })
    
    
})






app.listen(PORT,()=>{
    console.log(`server started at port: ${PORT}`)
})
