import React from 'react'
import { useState } from 'react'
import axios  from 'axios'

const Upload = () => {
  //event handler for file name
  const [file, setFile] = useState(null);
  const [fileName, setfileName] = useState("");
  const handleFileName=(e)=>{
    const file=e.target.files[0]
    if(file){
      setFile(file)
      setfileName(file.name)
      
    }
  }
  //event handler for expiry time
  const [expiryTime, setexpiryTime] = useState(0);
  const handleExpiryTime=(e)=>{
             const time=e.target.value.split("min")[0]
             setexpiryTime(Number(time))
           
  }

  const handleUpload=()=>{
    const formData= new FormData()
    formData.append("file", file)
    formData.append("expiry_time", expiryTime)
    axios.post('http://localhost:5000/upload', formData)
    .then(res => {
    console.log('Upload success:', res.data);
     })
    .catch(err => {
    console.error('Upload failed:', err);
    });
    
    
  }


  return (
    <div className='bg-[#0B1A33] w-full h-screen flex items-center justify-center'>
      <div className=' bg-gray-700 rounded-3xl text-center p-10 flex flex-col w-100 items-center '>
        <h1 className='text-4xl bold text-white'> Quick Drop</h1>
        <label
         for="file-upload"
         class="mt-8 flex flex-col items-center justify-center w-74 h-32 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer bg-gray-300 hover:bg-gray-400"
        >
        {fileName?(
          <p class="text-gray-600">file: {fileName}</p>)
          :
         ( <p class="text-gray-600">Click here to upload file</p>
        )}
        <input id="file-upload" type="file" class="hidden" onChange={handleFileName} />
        </label>
       
        <p className='mt-8 text-gray-300 text-sm'>expiration time:</p>
        <select className='mt-3 focus: outline-none p-1 text-white rounded-l bg-gray-500 w-full' onChange={handleExpiryTime}>
          <option className=' text-white rounded-l bg-gray-500'>5min</option>
          <option className=' text-white rounded-l bg-gray-500 '>10min</option>
          <option className=' text-white rounded-l bg-gray-500'>15min</option>
          <option className='text-white rounded-l bg-gray-500'>30min</option>
          <option className=' text-white rounded-l bg-gray-500'>1hour</option>
          <option className=' text-white rounded-l bg-gray-500'>2hour</option>
          <option className=' text-white rounded-l bg-gray-500'>6hr</option>
          <option className='text-white rounded-l bg-gray-500'>24hr</option>

        </select>
        
        <button className='mt-8 bg-blue-600 text-white rounded-md p-1 w-full cursor-pointer' onClick={handleUpload}>Upload File</button>

      </div>
    </div>
  )
}

export default Upload
