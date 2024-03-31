# PostCareAI-GPT

## [Link to Demo Video](https://drive.google.com/file/d/1yDAlUJm9CLMQKbuWsMi02N7M5k9KZCbH/view?usp=sharing)

- Features
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

- Tech Stack
    - React
    - Node.js
    - TailwindCSS
    - MongoDB
    - Redux
    - Nodemailer
    - Vite

- Step to Run the Application
    - client
        - Run the following commands in the /client directory
        
        ```bash
        cd client
        npm i
        npm run dev
        ```
        
    
    - server
        - Run the following commands in the /server directory
        
        ```bash
        cd server
        npm i
        npm start
        ```
        
        - And set up a .env file in the /server directory
        
        ```bash
        PORT = 5000
        MONGO_URL = "mongodb://localhost:27017"
        SITE_URL = "http://localhost:5173"
        JWT_PRIVATE_KEY = "some-private-key"
        OPENAI_API_KEY = "your-open-api-key"
        MAIL_EMAIL = "mail-id-for-mail-verification"
        MAIL_SECRET = "mail-app-password"
        ```
        
- Screenshots
