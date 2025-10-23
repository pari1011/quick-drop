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
  const [expiryTime, setexpiryTime] = useState(5);
  const handleExpiryTime = (e) => {
    const val = e.target.value
    if (val.endsWith("min")) {
    const time = val.split("min")[0];
    setexpiryTime(Number(time));
    }else if (val.endsWith("hr")) {
    const time = val.split("hr")[0];
    setexpiryTime(Number(time) * 60);
  }

             
           
  

  
  }
  const [Protection, setProtection] = useState(false);
  const handleProtection=(e)=>{
    setProtection(e.target.value)
  }

  const [password, setpassword] = useState("")
  const handlePassword=(e)=>{
    setpassword(e.target.value)
  }
  const [Visibility, setVisibility] = useState(true); //false-hide true-show
  const handlePasswordVisibility=()=>{
    if(Visibility==false){
      setVisibility(true)
    }
    else{
      setVisibility(false)
    }

  }
  const [UploadProgress, setUploadProgress] = useState(0);
  const [message, setmessage] = useState("")
  const [fileID, setfileID] = useState(null);
   const [url, seturl] = useState(null);
  const handleUpload=()=>{
    if(!file){
      alert('Please select a file')
    }else{
    const formData= new FormData()
    formData.append("file", file)
    formData.append("expiry_time", expiryTime)
    {
      password && formData.append("password", password)
    }
   
    axios.post("https://quick-drop-1.onrender.com/upload", 
      formData, 
      { onUploadProgress: (progressEvent) =>
         { const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
           setUploadProgress(percent<95 ? percent : 95 ); 

         } 
        })
          .then(res =>
             { console.log('Upload success:', res.data); 
               setUploadProgress(100)
               setfileID(res.data.fileID)
               seturl(`${window.location.origin}/download/${res.data.fileID}`)
               setUploadProgress(100) 
              }) 
          .catch(err =>
             {  console.error('Upload failed:', err)
                setmessage(err)
                
              })
     }
    
}
 
 
  
  
  const copyToClipboard=()=>{
    navigator.clipboard.writeText(url)
    .then(() => {
      alert("Link copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });

  }


  return (
    <div className='bg-[#0B1A33] w-full h-screen flex items-center justify-center'>
      <div className=' bg-gray-700 rounded-3xl text-center p-10 flex flex-col w-150 items-center '>
        <h1 className='text-4xl bold text-white'>Quick Drop-Upload</h1>
        <label
         htmlForfor="file-upload"
         className="mt-8 flex flex-col items-center justify-center w-74 h-32 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer bg-gray-300 hover:bg-gray-400"
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
          <option className=' text-white rounded-l bg-gray-500'>1hr</option>
          <option className=' text-white rounded-l bg-gray-500'>2hr</option>
          <option className=' text-white rounded-l bg-gray-500'>6hr</option>
          <option className='text-white rounded-l bg-gray-500'>24hr</option>

        </select>
        
        <p className='mt-8 text-gray-300 text-sm'>Would you like to make the file password protected?</p>
        <div className='flex gap-7 items-center text-xl'>
           <label className='mt-3 text-gray-300 cursor-pointer' >
            <input  type="radio" name="protection" value="true" onChange={handleProtection}/>
            Yes</label>
          
        <label className='mt-3 text-gray-300'>
            <input type="radio" name="protection" value="false" onChange={handleProtection} />
            No</label>
      

        </div>
        {Protection==="true"?
        (<div className='flex items-center justify-around w-full bg-gray-500 rounded-l mt-3 p-1'>
        <input type={Visibility? "password" : "text"} placeholder='please enter the password' className='focus: outline-none  text-white w-full text-center' onChange={handlePassword} value={password} />
        <button className='focus: outline-none text-gray-300 text-sm' onClick={handlePasswordVisibility}>{Visibility? "Show" : "Hide" }</button>
        </div>)
        :
        (<>
        </>)}
       
        
       <button className='mt-8 bg-blue-600 text-white rounded-md p-1 w-full cursor-pointer' onClick={handleUpload}>Upload File</button>
       {UploadProgress > 0 && (
       <>
       <div className='w-full mt-5 bg-gray-300 rounded-full h-4'>
       <div
        className={`${
          UploadProgress < 100 ? 'bg-green-500' : 'bg-blue-500'
        } h-4 rounded-full transition-all duration-300`}
        style={{ width: `${UploadProgress}%` }}>

       </div>
       </div>
       <p className='text-gray-200 mt-2 text-sm'>
       {UploadProgress < 100
        ? `${UploadProgress}% uploaded`
        : 'Upload complete! Generating link...'}
        </p>
       </>
)}

        {url?(
           <div className='mt-8'> 
          <p className='text-gray-300'>{message}</p>
          <p className='text-gray-300'>Here's your generated URl: </p>
          <div className='flex items-center justify-between gap-8 mt-3'>
             <a href={url} className='text-white rounded-l bg-gray-500 p-1'>{url}</a>
            <button className='bg-blue-600 text-white rounded-md  cursor-pointer p-1' onClick={copyToClipboard}> Copy Link</button>
          </div>
       </div>
        ):(<> </>)}
         
        
      </div>
      
    </div>
  )
}

export default Upload