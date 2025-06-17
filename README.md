# OsseoLab 3D Visualization Platform

**Senior Project – Computer Engineering, KMUTT**

This project was developed as a senior project by students from the Department of Computer Engineering, King Mongkut’s University of Technology Thonburi (KMUTT), in collaboration with **OsseoLab** — a company specializing in the design and production of 3D-printed implants for **maxillofacial orthopedic surgeries**.

## 🔍 Project Overview

OsseoLab required a platform to improve communication between their engineers and the doctors they support. Our web-based tool enables doctors to **interactively view and manipulate 3D models of their patients' facial structures**, based on CT scan data.

The platform allows surgeons to:

- 🧠 Visualize the patient’s 3D anatomy from CT scans
- 📏 Measure distances and angles directly on the 3D model
- ✂️ Simulate surgical cuts using interactive tools
- ⚙️ Test the fit of custom 3D-printed implants from OsseoLab

This helps doctors **plan surgeries with better accuracy**, aiming to **minimize the amount of facial structure removed** while ensuring the implant fits precisely.

## ⚙️ Key Features

- View and rotate 3D models from CT scans (STL files)
- Measure linear distances and angles between landmarks
- Cut the 3D model with a plane tool to simulate surgical cuts
- Load and preview OsseoLab-designed implants for compatibility
- Web-based: accessible via browser with no additional installation

## 🧪 Tech Stack

- **Frontend**: React + Three.js (via React Three Fiber)
- **Backend**: Flask + Trimesh
- **Database**: PostgreSQL
- **3D Engine**: Three.js + custom geometric calculations
- **Deployment**: Docker-based services

## 🏥 Why This Matters

This tool gives maxillofacial surgeons a way to **prepare and simulate surgeries before entering the operating room**. With precise visualization and manipulation, surgeons can plan minimally invasive procedures and ensure compatibility of OsseoLab's 3D-printed implants. This leads to better outcomes and faster recovery for patients.

## 📁 Project Structure
- **frontend**: React web application with 3D visualization tools
- **backend**: Flask API with STL processing logic (cutting, measuring)
- **database**: PostgreSQL schema and migration setup
- **docker**: Docker setup for full-stack deployment

## 🤝 Collaborators

- **OsseoLab** – Industrial partner providing real-world use cases and implant models
- **KMUTT CPE Department** – Project supervisors and academic support

## 📩 Contact & Environment Access

This project is currently **under development** and there is **no public demo available** at this time.  
If you need anything—such as `.env` configuration files or have any questions—please feel free to contact me:

**📧 nannapatintara@gmail.com**