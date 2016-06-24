NODE.JS project to create chatrooms with functioning image and media stream/share.

WHAT DO YOU NEED??

1. Node.JS (Can be downloaded at https://nodejs.org/en/download/ )
2. MongoDB (https://www.mongodb.com/)

Structure:

---> Server : copy.js (I will try to comment it more. Sorry!)

---> Login : login.html 
              NodeJS references all external dependency files like images and JQUERY files from the server itself.
              All these files and CSS are present in /files

---> Main Page : ex.html 

WHAT DO YOU NEED TO CHANGE?

--> Change your IP address in copy.js, login.html and ex.html. Open those files and search for a string like 192.168 and replace it with yours

HOW TO RUN?

--> If you have installed NODE.JS and MongoDB then execture copy.js from the command line.
--> Open the application in any browser on your network by writing your ip:8081/login. Example: 192.168.1.2:8081/login


THE PROJECT USES THE FOLLOWING MODULES:

1. Socket.io (http://socket.io/) for handling communications
2. Multer (https://github.com/expressjs/multer) for handling multipart data that is images and multimedia
