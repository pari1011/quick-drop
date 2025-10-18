import React from 'react'
import { useState , useEffect} from 'react'
import { useParams } from "react-router-dom"
import axios from 'axios'



const Download = () => {
  const [URL, setURL] = useState(null);
  const [Type, setType] = useState(null);
  const [expiryTimeLeft, setexpiryTimeLeft] = useState(null);
  const {id}=useParams()
  useEffect(()=>{
    axios.get(`http://localhost:5000/download/${id}`)
    .then(res=>{
        console.log(res)
        setURL(res.data.publicURL)
        setexpiryTimeLeft(res.data.expiresAfter)
        setType(res.data.fileType)

    })
    .catch(err=>console.log(err))
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
    <div className='bg-[#0B1A33] w-full h-screen flex items-center justify-center'>
      <div className=' bg-gray-700 rounded-3xl text-center p-10 flex flex-col w-150 items-center gap-8'>
        <h1 className='text-4xl bold text-white'>Quick Drop-Download</h1>
       
     
      {Type === "pdf" || Type==="mp4" ? (
        <>
          
          {
            expiryTimeLeft!= "expired already"?
            ( <div>
                <p className='text-gray-200'>File will expire after:</p>
                <p className='text-gray-100 text-xl'>  {expiryTimeLeft}</p>
                <iframe src={URL} className="w-100 h-[50vh] rounded-2xl mt-5" />
                <button className='bg-blue-600 text-white rounded-md  cursor-pointer p-1 mt-5' onClick={handleDownload}>Download</button>
             </div>
            )
            :
            (
            <p className='text-gray-400 text-2xl'>Oops! Expired Already</p>
            )
            
          }
          
         
          
          
          
        </>
      ) : (
        <>
        
          {
            expiryTimeLeft!= "expired already"?
            (
                <div>
                <p className='text-gray-200'>File will expire after:</p>
                <p className='text-gray-100 text-xl'>  {expiryTimeLeft}</p>
                <img src={URL} className=" rounded-2xl mt-5" />
                 <button className='bg-blue-600 text-white rounded-md  cursor-pointer p-1 mt-5' onClick={handleDownload}>Download</button>
              </div>

            )
            :
            (
            <p className='text-gray-400 text-2xl'>Oops! Expired Already</p>
            )
            
          }
          
          
          
         
        </>
      )}
      
       </div>
    </div>
  );
}

export default Download
