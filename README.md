## Quick Drop – Secure Temporary File Sharing App

A minimal and fast web application that allows users to **upload files and share them through temporary links**.  
Each file automatically expires after a chosen time, ensuring privacy and storage efficiency.  

## Live Demo

-  **Frontend:** [https://comfy-florentine-565281.netlify.app](https://comfy-florentine-565281.netlify.app)
- **Backend (API):** [https://quick-drop-1.onrender.com](https://quick-drop-1.onrender.com)


---

##  Features

### Core
- **Instant File Uploads** — Upload files with a simple click interface.  
- **No Login Needed** — Just upload and share.  
- **Expiring Links** — Choose expiration (10 min, 1 hr, 24 hrs). Files auto-delete after expiry.  
- **Unique Shareable Links** — Each file gets a non-guessable URL.

###  Bonus Features (Medium Difficulty)
- **Password Protection:** Set a password during upload to secure your file.  
- **Real-Time Upload Progress:** See live progress percentage during file upload.  

###  Automatic Cleanup
- A background **cron job** deletes expired files periodically.  

---
## Tech Stack

**Frontend:**  
- React.js  
- Axios  
- Tailwind CSS  

**Backend:**  
- Node.js  
- Express.js  
- Supabase (for storage & database)  
- NanoID (for unique link generation)  
- Node-cron (for auto deletion of expired files)  

---

## Preview

> Example UI:

- **Upload Page:**  
  - Choose file, set password & expiry, track upload progress.  
- **Download Page:**  
  - Shows file name, size, and remaining time before expiry.  
  - Prompts for password if protected.

---

## Video Demonstration

 Watch the full walkthrough here: [Click to View](https://drive.google.com/file/d/1vdUAXOn5xtQeoJIc9Nqd5oxg1zP_ykaP/view?usp=drivesdk)


