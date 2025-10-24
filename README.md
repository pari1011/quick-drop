#Quick Drop – Secure Temporary File Sharing App

A minimal and fast web application that allows users to **upload files and share them through temporary links**.  
Each file automatically expires after a chosen time, ensuring privacy and storage efficiency.  

Built with **React + Node.js + Supabase Storage**, featuring:
-  Password-protected downloads  
-  Real-time upload progress bar  
-  Auto-expiring links  

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

| Layer | Technology |
|-------|-------------|
| Frontend | React / Next.js |
| Backend | Node.js + Express |
| Storage | Supabase Storage |
| Database | Supabase / MongoDB |
| Deployment | Netlify (Frontend) + Render / Railway (Backend) |

---

## Preview

> Example UI:

- **Upload Page:**  
  - Choose file, set password & expiry, track upload progress.  
- **Download Page:**  
  - Shows file name, size, and remaining time before expiry.  
  - Prompts for password if protected.

---

