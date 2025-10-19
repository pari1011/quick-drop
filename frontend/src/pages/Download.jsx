import React from 'react'
import { useState , useEffect} from 'react'
import { useParams } from "react-router-dom"
import axios from 'axios'



const Download = () => {
  
  const [name, setname] = useState(null);
  const [URL, setURL] = useState(null);
  const [Type, setType] = useState(null);
  const [size, setsize] = useState(null);
  const [expiryTimeLeft, setexpiryTimeLeft] = useState(null);
  const [message, setmessage] = useState(null);
  const {id}=useParams()
  useEffect(()=>{
    axios.get(`http://localhost:5000/download/${id}`)
    .then(res=>{
        console.log(res)
        setname(res.data.fileName)
        setURL(res.data.publicURL)
        setexpiryTimeLeft(res.data.expiresAfter)
        setType(res.data.fileType)
        setsize(res.data.fileSize)

    })
    .catch(err=>{
        console.log(err)
        setmessage(err)
    }
  )
  })
  const handleDownload=async()=>{
    const response=await fetch(URL)//fetch file data
    const blob=await response.blob() //convert response to blob(binary data)
    const blobURL= window.URL.createObjectURL(blob)


    //create a hidden link element
    const link=document.createElement('a')
    link.href=blobURL
    link.download=`myfile.${Type}`
    document.body.appendChild(link)
    link.click()
    
  }
  return (
    <>
    {message?(<>
      <div className='bg-[#0B1A33] w-full h-screen flex items-center justify-center p-20'>
              <div className=' bg-gray-700 rounded-3xl text-center p-10 flex flex-col w-150 items-center gap-8'>
              <h1 className='text-4xl bold text-white'>Quick Drop-Download</h1>
              <p className='text-gray-400 text-2xl'>Oops! Expired Already</p>
              </div>
              </div>
      </>
    ):
    (
      <>
   
     
      {Type === "pdf" || Type==="mp4" ? (
        <>
          
          {
            expiryTimeLeft!= "expired already"?
            ( <div className='bg-[#0B1A33] w-full h-screen flex items-center justify-center p-20'>
              <div className=' bg-gray-700 rounded-3xl text-center p-10 flex flex-col w-150 items-center'>
                <h1 className='text-4xl bold text-white'>Quick Drop-Download</h1>
       
     
                <p className='text-gray-200 mt-3'>File Name:</p>
                <p className='text-gray-100 text-xl'>{name}</p>
                <p className='text-gray-200 mt-3'>File Size(in bytes):</p>
                <p className='text-gray-100 text-xl'>{size}</p>
                <p className='text-gray-200 mt-3'>File will expire after:</p>
                <p className='text-gray-100 text-xl'>  {expiryTimeLeft}</p>
                <iframe src={URL} className="w-100 h-[50vh] rounded-2xl mt-5" />
                <button className='bg-blue-600 text-white rounded-md  cursor-pointer p-1 mt-5' onClick={handleDownload}>Download</button>
              </div>
             </div>
            )
            :
            (
              <>
             
              <div className='bg-[#0B1A33] w-full h-screen flex items-center justify-center p-20'>
              <div className=' bg-gray-700 rounded-3xl text-center p-10 flex flex-col w-150 items-center gap-8'>
              <h1 className='text-4xl bold text-white'>Quick Drop-Download</h1>
              <p className='text-gray-400 text-2xl'>Oops! Expired Already</p>
              </div>
              </div>
               </>
            )
            
          }
          
         
          
          
          
        </>
      ) : (
        <>
        
          {
            expiryTimeLeft!= "expired already"?
            (
               <div className='bg-[#0B1A33] w-full min-h-screen flex items-center justify-center p-20'>
               <div className=' bg-gray-700 rounded-3xl text-center p-10 flex flex-col w-150 items-center'>
                <h1 className='text-4xl bold text-white'>Quick Drop-Download</h1>
                <p className='text-gray-200 mt-3'>File Name:</p>
                <p className='text-gray-100 text-xl'>{name}</p>
                <p className='text-gray-200 mt-3'>File Size(in bytes):</p>
                <p className='text-gray-100 text-xl'>{size}</p>
                <p className='text-gray-200 mt-3'>File will expire after:</p>
                <p className='text-gray-100 text-xl'>  {expiryTimeLeft}</p>
                <img src={URL} className=" rounded-2xl mt-5" />
                 <button className='bg-blue-600 text-white rounded-md  cursor-pointer p-1 mt-5' onClick={handleDownload}>Download</button>
              </div>
              </div>

            )
            :
            (
           
              <>
             
              <div className='bg-[#0B1A33] w-full h-screen flex items-center justify-center p-20'>
              <div className=' bg-gray-700 rounded-3xl text-center p-10 flex flex-col w-150 items-center gap-8'>
              <h1 className='text-4xl bold text-white'>Quick Drop-Download</h1>
              <p className='text-gray-400 text-2xl'>Oops! Expired Already</p>
              </div>
              </div>
               </>
            )
            
          }
          
          
          
         
        </>
      )}
      
      
   </>
    )}
   </>  
  );
}

export default Download
