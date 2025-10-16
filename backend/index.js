const express=require('express')
const app=express()
const PORT= 5000

app.get('/test', (req,res)=>{
    res.json({message: "hello from backend"})
})

app.listen(PORT,()=>{
    console.log(`server started at port: ${PORT}`)
})
