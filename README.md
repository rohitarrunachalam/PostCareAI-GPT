# PostCareAI-GPT

## Objective
This pre-work is designed to assess your user needs, problem-solving, design, and coding
skills. You will reimagine the ChatGPT interface in a healthcare setting by identifying its
flaws and suggesting improvements and then implement a prototype of your design.

## [Link to Demo Video](https://drive.google.com/file/d/1yDAlUJm9CLMQKbuWsMi02N7M5k9KZCbH/view?usp=sharing)
## [Link to Figma Design](https://www.figma.com/file/peL1mq2qoTmmgWCJkbHxA2/PostCare.AI?type=design&node-id=0%3A1&mode=design&t=eou4FB3YoAMyhpLD-1)

## Features
- Authentication
- Email Verification
- Chat
- Responsive
- Clear Chats
- OpenAI API Integration
- Extra Features
    - Search Bar for searching through Chat History
    - Related  Questions Feature (Gives follow-up questions related to the prompt)
    - Folders (Group multiple chats into one folder for quicker access)
    - Healthcare Related (Send prompts with sub string #Symptoms, #Appointment, #Remainder, #Emergency to get response related to the prompt)
        - Symptoms Checker
        - Pill Remainder
        - Appointment Scheduler
        - Emergency Tele Assistant
        - Only Restricted to HealthCare related queries

## Tech Stack
- React
- Node.js
- TailwindCSS
- MongoDB
- Redux
- Nodemailer
- Vite

## Step to Run the Application
- client
Run the following commands in the /client directory
```
cd client
npm i
npm run dev
```
        
    
- server
Run the following commands in the /server directory
```
cd server
npm i
npm start
```
        
- And set up a .env file in the /server directory
```
PORT = 5000
MONGO_URL = "mongodb://localhost:27017"
SITE_URL = "http://localhost:5173"
JWT_PRIVATE_KEY = "some-private-key"
OPENAI_API_KEY = "your-open-api-key"
MAIL_EMAIL = "mail-id-for-mail-verification"
MAIL_SECRET = "mail-app-password"
```

## Screenshots
<img width="659" alt="image" src="https://github.com/rohitarrunachalam/PostCareAI-GPT/assets/93265718/649492c4-64db-40f2-8523-a91bfb3fc72f">
<img width="659" alt="image" src="https://github.com/rohitarrunachalam/PostCareAI-GPT/assets/93265718/c110319e-7319-407d-a2f7-caa49009086a">
<img width="660" alt="image" src="https://github.com/rohitarrunachalam/PostCareAI-GPT/assets/93265718/c139e7ca-417e-4f6e-b670-d498aca0b870">


        
