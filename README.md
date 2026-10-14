🌱 EcoTrack — Smart Carbon Footprint Tracker



EcoTrack is a full-stack web application that helps users track daily activities and understand their estimated carbon footprint.



✨ Features



\- 🔐 User registration and login with JWT authentication

\- 🌍 Track activities across multiple categories

\- 🧮 Estimate carbon emissions based on activity type and quantity

\- 📊 Dashboard with carbon statistics and category-wise charts

\- 🔎 Search activities and filter by category or date

\- 🗑️ Delete recorded activities

\- 💡 Smart Eco Insights

\- 📱 Responsive user interface



🛠️ Tech Stack



\- Frontend: React, TypeScript, Vite, Recharts

\- Backend: Node.js, Express.js

\- Database: MongoDB, Mongoose

\- Authentication: JSON Web Tokens (JWT), bcryptjs



🚀 Getting Started



Prerequisites



Install the following before running EcoTrack:



\- Node.js and npm

\- MongoDB Community Server

\- Git



1\. Clone the Repository



git clone YOUR\_GITHUB\_REPOSITORY\_URL

cd EcoTrack



Replace "YOUR\_GITHUB\_REPOSITORY\_URL" with your actual GitHub repository URL.



2\. Set Up the Backend



cd backend

npm install



Create a ".env" file inside the "backend" folder and add:



JWT\_SECRET=replace\_with\_a\_strong\_random\_secret



Use your own strong, randomly generated secret. Never publish your ".env" file.



Make sure MongoDB is running locally at:



"mongodb://127.0.0.1:27017/ecotrack"



Start the backend:



node index.js



Backend URL: "http://localhost:5000"



3\. Set Up the Frontend



Open a second terminal from the project root and run:



cd frontend-new

npm install

npm run dev -- --port 5174



Open "http://localhost:5174" in your browser.



Note: If PowerShell blocks npm commands, use "npm.cmd" instead of "npm".



📌 Important Note



Carbon emission factors used in EcoTrack are demonstration estimates. Actual emissions vary depending on location, transport type, energy source, food choices, and other factors. The estimates should not be treated as verified measurements.



🔒 Security



\- Keep ".env" files and secrets private.

\- Use a strong, unique JWT secret.

\- Never publish passwords, authentication tokens, or private credentials.



👨‍💻 Author



Adarsh Badatya



Built with 🌱 to encourage more sustainable everyday choices.

