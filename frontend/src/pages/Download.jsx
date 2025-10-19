import React from 'react'
import { useState , useEffect} from 'react'
import { useParams } from "react-router-dom"
import axios from 'axios'



const Download = () => {

  const [name, setname] = useState(null); //filename
  const [URL, setURL] = useState(null); //filelink
  const [Type, setType] = useState(null); //filetype
  const [size, setsize] = useState(null); //filesize
  const [expiryTimeLeft, setexpiryTimeLeft] = useState(null); //expirytime
  const [password, setpassword] = useState(null); //filepassword
  const [message, setmessage] = useState(null); //sucessfull/failure in upload
  const [inputpsswd, setinputpsswd] = useState(""); //password input by user
  const [status, setstatus] = useState(null); //to check if passwrod is correct or not
  const {id}=useParams()  //getting id from the url
  useEffect(()=>{
    axios.get(`http://localhost:5000/download/${id}`)
    .then(res=>{
        console.log(res)
        setname(res.data.fileName)
        setURL(res.data.publicURL)
        setexpiryTimeLeft(res.data.expiresAfter)
        setType(res.data.fileType)
        setsize(res.data.fileSize)
        setpassword(res.data.password)

    })
    .catch(err=>{
        console.log(err)
        setmessage(err)
    }
  )
  })

  const handleInputPassword=(e)=>{
    setinputpsswd(e.target.value)
  }

  const handleSubmit=()=>{
    if(inputpsswd===password){
      setstatus("true")
      alert('Password is correct')
    }
    else{
      setstatus("false")
      alert('Password is incorrect! Please try again...')
      setinputpsswd("")

    }
    
  }
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
    {/* first check if the file is password protected */}
    {password ? (
      <>
      {/* if yes */}
      {/* case1: password not entered yet */}
      {status==null && (
                    <>

                    <div className="bg-[#0B1A33] w-full h-screen flex items-center justify-center p-20">
                      <div className="bg-gray-700 rounded-3xl text-center p-10 flex flex-col w-150 items-center gap-8">
                        <h1 className="text-4xl font-bold text-white">Quick Drop-Download</h1>
                        <p className="text-gray-400 text-2xl">This file is password protected</p>
                        <input type="text" placeholder='please enter the password' className='mt-3 focus: outline-none p-1 text-white rounded-l bg-gray-500 w-full text-center' onChange={handleInputPassword} value={inputpsswd} />
                        <button
                        className="bg-blue-600 text-white rounded-md cursor-pointer p-1 mt-5"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                      </div>
                    </div>

                      
                      </>)
    }
     {/* case2: wrong password entered */}
     {status=="false" && (
                    <>

                    <div className="bg-[#0B1A33] w-full h-screen flex items-center justify-center p-20">
                      <div className="bg-gray-700 rounded-3xl text-center p-10 flex flex-col w-150 items-center gap-8">
                        <h1 className="text-4xl font-bold text-white">Quick Drop-Download</h1>
                        
                        <input type="text" placeholder='please enter the correct password' className='mt-3  p-1 border  border-red-600 text-white rounded-l bg-gray-500 w-full text-center' onChange={handleInputPassword} value={inputpsswd} />
                        <button
                        className="bg-blue-600 text-white rounded-md cursor-pointer p-1 mt-5"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                      </div>
                    </div>

                      
                      </>)
    }
     {/* case3: correct password entered */}
     {status=="true" && (
       <>
        {/* check if the file exits in database or not */}
        {message ? (
          <>
           {/* expired already case and deleted from database */}
            <div className="bg-[#0B1A33] w-full h-screen flex items-center justify-center p-20">
              <div className="bg-gray-700 rounded-3xl text-center p-10 flex flex-col w-150 items-center gap-8">
                <h1 className="text-4xl font-bold text-white">Quick Drop-Download</h1>
                <p className="text-gray-400 text-2xl">Oops! Expired Already</p>
              </div>
            </div>
          </>
        ) : (
          <>
           {/* else */}
           {/* checking if pdf then iframe else img */}
            {Type === "pdf" || Type === "mp4" ? (
              <> 
                {/* checking if expired */}
                {expiryTimeLeft !== "expired already" ? (
                  <div className="bg-[#0B1A33] w-full min-h-screen flex items-center justify-center p-20">
                    <div className="bg-gray-700 rounded-3xl text-center p-10 flex flex-col w-150 items-center">
                      <h1 className="text-4xl font-bold text-white">Quick Drop-Download</h1>
                      <p className="text-gray-200 mt-3">File Name:</p>
                      <p className="text-gray-100 text-xl">{name}</p>
                      <p className="text-gray-200 mt-3">File Size (in bytes):</p>
                      <p className="text-gray-100 text-xl">{size}</p>
                      <p className="text-gray-200 mt-3">File will expire after:</p>
                      <p className="text-gray-100 text-xl">{expiryTimeLeft}</p>
                      <iframe
                        src={URL}
                        className="w-100 h-[50vh] rounded-2xl mt-5"
                        title="file-preview"
                      />
                      <button
                        className="bg-blue-600 text-white rounded-md cursor-pointer p-1 mt-5"
                        onClick={handleDownload}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#0B1A33] w-full h-screen flex items-center justify-center p-20">
                    <div className="bg-gray-700 rounded-3xl text-center p-10 flex flex-col w-150 items-center gap-8">
                      <h1 className="text-4xl font-bold text-white">Quick Drop-Download</h1>
                      <p className="text-gray-400 text-2xl">Oops! Expired Already</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {expiryTimeLeft !== "expired already" ? (
                  <div className="bg-[#0B1A33] w-full min-h-screen flex items-center justify-center p-20">
                    <div className="bg-gray-700 rounded-3xl text-center p-10 flex flex-col w-150 items-center">
                      <h1 className="text-4xl font-bold text-white">Quick Drop-Download</h1>
                      <p className="text-gray-200 mt-3">File Name:</p>
                      <p className="text-gray-100 text-xl">{name}</p>
                      <p className="text-gray-200 mt-3">File Size (in bytes):</p>
                      <p className="text-gray-100 text-xl">{size}</p>
                      <p className="text-gray-200 mt-3">File will expire after:</p>
                      <p className="text-gray-100 text-xl">{expiryTimeLeft}</p>
                      <img src={URL} className="rounded-2xl mt-5" alt="preview" />
                      <button
                        className="bg-blue-600 text-white rounded-md cursor-pointer p-1 mt-5"
                        onClick={handleDownload}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#0B1A33] w-full h-screen flex items-center justify-center p-20">
                    <div className="bg-gray-700 rounded-3xl text-center p-10 flex flex-col w-150 items-center gap-8">
                      <h1 className="text-4xl font-bold text-white">Quick Drop-Download</h1>
                      <p className="text-gray-400 text-2xl">Oops! Expired Already</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </>
                    )
    }
      
     
      </>
    ) : (
      <>
      {/* incase no password protection */}
        {message ? (
          <>
            <div className="bg-[#0B1A33] w-full h-screen flex items-center justify-center p-20">
              <div className="bg-gray-700 rounded-3xl text-center p-10 flex flex-col w-150 items-center gap-8">
                <h1 className="text-4xl font-bold text-white">Quick Drop-Download</h1>
                <p className="text-gray-400 text-2xl">Oops! Expired Already</p>
              </div>
            </div>
          </>
        ) : (
          <>
            {Type === "pdf" || Type === "mp4" ? (
              <>
                {expiryTimeLeft !== "expired already" ? (
                  <div className="bg-[#0B1A33] w-full min-h-screen flex items-center justify-center p-20">
                    <div className="bg-gray-700 rounded-3xl text-center p-10 flex flex-col w-150 items-center">
                      <h1 className="text-4xl font-bold text-white">Quick Drop-Download</h1>
                      <p className="text-gray-200 mt-3">File Name:</p>
                      <p className="text-gray-100 text-xl">{name}</p>
                      <p className="text-gray-200 mt-3">File Size (in bytes):</p>
                      <p className="text-gray-100 text-xl">{size}</p>
                      <p className="text-gray-200 mt-3">File will expire after:</p>
                      <p className="text-gray-100 text-xl">{expiryTimeLeft}</p>
                      <iframe
                        src={URL}
                        className="w-100 h-[50vh] rounded-2xl mt-5"
                        title="file-preview"
                      />
                      <button
                        className="bg-blue-600 text-white rounded-md cursor-pointer p-1 mt-5"
                        onClick={handleDownload}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#0B1A33] w-full h-screen flex items-center justify-center p-20">
                    <div className="bg-gray-700 rounded-3xl text-center p-10 flex flex-col w-150 items-center gap-8">
                      <h1 className="text-4xl font-bold text-white">Quick Drop-Download</h1>
                      <p className="text-gray-400 text-2xl">Oops! Expired Already</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {expiryTimeLeft !== "expired already" ? (
                  <div className="bg-[#0B1A33] w-full min-h-screen flex items-center justify-center p-20">
                    <div className="bg-gray-700 rounded-3xl text-center p-10 flex flex-col w-150 items-center">
                      <h1 className="text-4xl font-bold text-white">Quick Drop-Download</h1>
                      <p className="text-gray-200 mt-3">File Name:</p>
                      <p className="text-gray-100 text-xl">{name}</p>
                      <p className="text-gray-200 mt-3">File Size (in bytes):</p>
                      <p className="text-gray-100 text-xl">{size}</p>
                      <p className="text-gray-200 mt-3">File will expire after:</p>
                      <p className="text-gray-100 text-xl">{expiryTimeLeft}</p>
                      <img src={URL} className="rounded-2xl mt-5" alt="preview" />
                      <button
                        className="bg-blue-600 text-white rounded-md cursor-pointer p-1 mt-5"
                        onClick={handleDownload}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#0B1A33] w-full h-screen flex items-center justify-center p-20">
                    <div className="bg-gray-700 rounded-3xl text-center p-10 flex flex-col w-150 items-center gap-8">
                      <h1 className="text-4xl font-bold text-white">Quick Drop-Download</h1>
                      <p className="text-gray-400 text-2xl">Oops! Expired Already</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </>
    )}
  </>
);

}

export default Download
