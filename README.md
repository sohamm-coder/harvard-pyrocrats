# Rare Disease Healthcare Platform

A web-based healthcare platform developed during the Harvard Rare Disease Hackathon to support individuals living with rare diseases. The application provides a centralized ecosystem for disease information, community engagement, health tracking, expert consultation, crowdfunding, and educational resources.

The platform is designed to improve accessibility to healthcare information while fostering collaboration between patients, caregivers, healthcare professionals, and support communities.

---

# Features

- Patient Dashboard
- Disease Diagnosis Support
- Sleep Tracking
- Community Discussion Forum
- Expert Consultation
- Educational Resources
- Crowdfunding Support
- Multilingual Support
- Interactive Health Analytics
- Secure User Authentication
- Responsive User Interface

---

# System Architecture

```
                    User
                      │
                      ▼
                React Frontend
                      │
         ┌────────────┼────────────┐
         ▼            ▼            ▼
 Authentication   Healthcare    Community
   (Firebase)      Modules        Services
         │            │              │
         └────────────┼──────────────┘
                      │
                Firebase Backend
                      │
              Real-time Database
```

---

# Technology Stack

## Frontend

- React.js
- JavaScript
- HTML5
- CSS3

## Backend Services

- Firebase Authentication
- Firebase Firestore

## Visualization

- Chart.js

## Development Tools

- Git
- GitHub
- npm

---

# Project Modules

## Patient Dashboard

Provides users with a centralized dashboard to access healthcare information, monitor activities, and navigate platform services.

---

## Diagnosis Support

Allows users to explore disease-related information and access healthcare guidance.

---

## Sleep Tracker

Enables users to record and monitor sleep-related health information.

---

## Community Forum

Provides a collaborative environment where patients and caregivers can discuss experiences, ask questions, and share knowledge.

---

## Expert Connect

Allows users to connect with healthcare professionals for consultation and guidance.

---

## Education Hub

Offers educational content and healthcare resources related to rare diseases.

---

## Crowdfunding

Supports fundraising initiatives for medical treatments and community assistance.

---

## Multilingual Support

Improves accessibility by supporting multiple languages for diverse user communities.

---

# Folder Structure

```
src/

├── components/
│
├── pages/
│   ├── Dashboard
│   ├── Diagnosis
│   ├── SleepTracker
│   ├── Community
│   ├── ExpertConnect
│   ├── Education
│   ├── Crowdfunding
│
├── firebase/
│
├── assets/
│
├── App.js
└── index.js
```

---

# Key Functionalities

### Authentication

- Secure user authentication using Firebase.

### Healthcare Services

- Disease information
- Patient support
- Expert consultation

### Analytics

- Interactive charts for health visualization.

### Community

- Forums and collaborative discussion platform.

---

# Future Enhancements

- AI-powered disease recommendation system
- Medication reminder system
- Nutrition and calorie tracking
- Wearable device integration
- Appointment scheduling
- Telemedicine support
- Electronic Health Record (EHR) integration
- Personalized health recommendations

---

# Getting Started

## Clone Repository

```bash
git clone https://github.com/sohamm-coder/harvard-pyrocrats.git
```

## Install Dependencies

```bash
npm install
```

## Run the Application

```bash
npm start
```

The application will start at:

```
http://localhost:3000
```

---

# Contributors

Developed during the **Harvard Rare Disease Hackathon** by Team Pyrocrats.

---

# Author

**Soham Mahajan**

MS Computer Science  
University of Massachusetts Dartmouth

GitHub: https://github.com/sohamm-coder

LinkedIn: https://www.linkedin.com/in/sohammahajan
