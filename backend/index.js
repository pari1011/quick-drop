require('dotenv').config()
const cron=require("node-cron")

const cors=require("cors")

//connecting with supabase
const { createClient } = require('@supabase/supabase-js')

//creating supabase client instance
const supabase=createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
console.log('success') //print success in case of sucessfull connection b/w node js and supabase

//importing nanoid for generating unique file ids
const {nanoid}=require('nanoid')

//initialise express
const express=require('express')
const app=express()

app.use(cors()); // allows all origins
app.use(express.json()); // for parsing JSON body

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

    //unique file name incase multiple files have similar names
    //used replace function here to fix the bug for files having special characters except underscores and dots maybe pdfs

    const fileName=nanoid(3) + file.originalname

    //uploading file to supabase storage
    const {data:uploadData, error:uploadError}=await 
    supabase.storage
    .from("uploads") //bucket-name
    .upload(fileName,file.buffer, {contentType: file.mimetype})//file.buffer contains file data in binary format
    
    if (uploadError) {
      console.error("Error uploading file to Supabase:", uploadError.message);
      return res.status(500).json({ error: "File upload failed" });
    }

    console.log("File upload to Supabase: success");
    //retrieving the public url in case of successful upload
   
    const {data: publicData}= //public data is object too that contains a key public url
    supabase.storage
         .from("uploads")
         .getPublicUrl(fileName)
    const fileLink=publicData.publicUrl
    console.log("link generated successfully")
    

    //after uploading file to supabase 
    //generate random 10character id to generate unique non guessable link for each uploaded file
    const fileID=nanoid(10) 
     
    //extracting expiry time from request
    const expiryTime=Number(req.body.expiry_time) //by default string

    //inserting the unique id, publicURL into table files
    const { data:insertData, error:insertError } = await supabase
   .from("files")
   .insert([
    {
      file_ID: fileID,
      file_Name: fileName,
      file_link: fileLink,
      expiry_time: new Date(Date.now() + expiryTime * 60 * 1000).toISOString(),
      file_type:file.mimetype.split('/')[1],
      file_size:file.size,
      password:req.body.password
     
      
    },
  ])
  .select();

    if(insertError){
        console.log("error inserting data", insertError)

    }else{
        console.log("successfully inserted data ")
    }


    res.status(200).json({
        message: "file uploaded successfully",
        fileID: fileID
    })
    
    
})
//defining get route at download 
app.get('/download/:fileID' , async(req,res)=>{

    const fileID=req.params.fileID

   
    //fetching matching record from supabase table
    const {data:findData,error:findError}= await supabase
       .from('files')
       .select("*")
       .eq("file_ID", fileID)
       .single()

    


    if(findError){
        return res.status(404).json({error: "File not found"})
    }else{
        //expiry time calculation
        const now=new Date().getTime()
        const expiry=new Date(findData.expiry_time).getTime()
        const remainingTime=expiry-now 
        if(remainingTime<0){
            res.status(200).json({
                fileName: findData.file_Name.slice(3),
                publicURL: findData.file_link,
                fileType: findData.file_type,
                fileSize: findData.file_size,
                password: findData.password,
                expiresAfter: "expired already"
            })   
        }else{
            const hours=Math.floor(remainingTime/(1000*60*60))
            const minutes=Math.floor(remainingTime%(1000*60*60)/(60*1000))
            const seconds=Math.floor(remainingTime%(1000*60)/1000)
            res.status(200).json({
                fileName: findData.file_Name.slice(3),
                publicURL: findData.file_link,
                fileType: findData.file_type,
                fileSize: findData.file_size,
                password: findData.password,
                expiresAfter: `${hours}hours and ${minutes}minutes and ${seconds}seconds`
            })
            
        }   
    }
       
    }
)

//function for deleting expired files
const deleteExpiredFiles=async()=>{
    const now=new Date().toISOString()

    //fetch all expired files from databse
    const{data:dataExpiredFiles, error:errorExpiredFiles}= await supabase
         .from('files')
         .select("*")
         .lte("expiry_time", now) //less than or equal to

    if(errorExpiredFiles) {
         console.log("error in fetching expired files")
    }else{
         console.log(dataExpiredFiles)//an array containing each record as objects

         //loop through and delete each file
         for(const expiredFile of dataExpiredFiles){
            try{
            //delete from storage
            const filePath = expiredFile.file_link.split('/uploads/')[1];
            const {error: storageError}=await supabase.storage
              .from('uploads')
              .remove([filePath])


            if(storageError){
                throw storageError
                continue; //skip database deletion if storage deletetion fails
            }

            //delete from database
            const {error:dbError}=await supabase
             .from('files')
             .delete()
             .eq("file_ID", expiredFile.file_ID )
             if(dbError){
               throw dbError
             }
            


            }catch(err){
                console.error(`Failed to delete this file ${expiredFile.file_Name}`, err)
            }

        
        }

    }

}

//implementing node-cron for periodic check of expired files and delete them automatically
cron.schedule("*/5 * * * *", async()=>{
    console.log("periodic check started...")
    await deleteExpiredFiles()
    console.log("completed successfully")
})








app.listen(PORT,()=>{
    console.log(`server started at port: ${PORT}`)
})
