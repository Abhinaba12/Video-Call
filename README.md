# Video-Call
The Peer-to-Peer WebRTC Video Call System, is a communication platform built on the robust foundation of the MERN stack, WebRTC, and WebSockets. 
This project empowers users with seamless, real-time video communication, featuring user-friendly functionalities such as peer-to-peer video calls, secure login/signup processes, and 
convenient toggling of microphone and video settings.

# Installation and local setup
* Clone the repository: git clone https://github.com/Abhinaba12/Video-Call.git

* Server Setup:
   * Move into the Server Folder: cd Server
   * Install Dependencies :
     ``` bash
      npm install
     ```
     
   * Create a .env file 
   * Create a MongoDB account at (https://www.mongodb.com/), establish a Cluster, and generate the MongoDB URI. Paste the generated MongoDB URI into the .env file:
      * MONGO = "YOUR MONGO URI HERE"
   * Also create a JWT secret and add it in the .env file:
      * JWT_SECRET = "YOUR JWT SECRET HERE"
        
   * To Start the Server :
     ``` bash
     nodemon server.js or node server.js
     ```

* Client Setup:
    * Move into the Client Folder: cd Client
    * Install Dependencies :
      ``` bash
      npm install
      ```
      
    * To Start Client :
      ``` bash
       npm run dev
      ```

 * How to Run the Application?
     * Start the Server.
     * Start the Client in two different browsers.
     * Register for two distinct accounts and log in to those accounts.
     * Create a room from one account using a room ID.
     * Join the same room from another account using the room ID.
     * After entering the room, any user can initiate a call using the "Start Call" button, and the call will be connected.
     * To end the call, any user can terminate it, and the call will be disconnected, redirecting both users to the home page.

