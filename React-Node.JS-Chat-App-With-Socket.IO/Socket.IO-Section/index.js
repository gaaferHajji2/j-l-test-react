const { Server } = require("socket.io");

// const express = require('express');

// const app = express();

// const http = require('http');

// const server = http.createServer(app);

const io = new Server(3000, { cors: "http://localhost:5173" });

let onlineUsers = [];

io.on("connection", (socket) => {
    // console.log("The Socket ID is: ", socket.id);

    // console.log("The Connected Sockets are: ", Object.keys(io.sockets.sockets));

    socket.on("disconnect", () => {
        // console.log("Socket has been disconnected, with socket id: ", socket.id);
        // console.log("The Reason Has Been: ", reason);
        // console.log("The Description Has Been: ", description);

        // onlineUser = onlineUser.filter(userId => )

        onlineUsers = onlineUsers.filter(user => user.socketId != socket.id);

        io.emit("getOnlineUsers", onlineUsers);
    });

    // add Message
    socket.on("addMessage", (message)=> {
        // console.log("New Message Has Been Added With Data: ", message);
        // console.log("The Recipient is: ", message.recipientId);

        // console.log("The Online Users Are: ", onlineUsers);

        const user = onlineUsers.find(t1 => t1.userId === message.recipientId);

        // console.log("The Recipient User is: ", user);

        if(user) {
            // console.log("The Message That Will Be Send IN Real-Time: ", message, " with socketId: ", user.socketId);

            io.to(user.socketId).emit("getMessage", message);

            console.log("--------------------------------------------------------");
            console.log("The sender ID is: ", message.sender?._id);
            console.log("--------------------------------------------------------");

            io.to(user.socketId).emit("getNotification", {
                senderId: message.sender?._id,
                isRead: false,
                date: new Date(),
            });

            // io.emit("generalMessage", message);
        } else {
            console.log("--------------------------------------------------------");
            console.log("The User is Not Online");
            console.log("--------------------------------------------------------");
        }
    });

    socket.on("addNewUser", (userId) => {
        /// * Here We Must Take In Consideration That The Socket Has Been Changed.
        /// * So we Must Update the Value of SocketID.
        let t1 = onlineUsers.find(user => user.userId === userId);

        // if (t1) {
        //     // console.log("We Have Update The Data For: ", socket.id, ", UserId is: ", userId);

        //     // onlineUsers = onlineUsers.map(user => user.userId === userId ? {
        //     //     userId: userId,
        //     //     socketId: socket.id,
        //     // } : user);
        // }

        if (t1) {
            // console.log("We Have Duplicate For userId: ", userId);
        } else {
            // console.log("We Have New User For Inserting Data: ", userId);

            onlineUsers.push({
                userId,
                socketId: socket.id,
            });

            // console.log("The Online Users Are: ", onlineUsers);
        }

        io.emit("getOnlineUsers", onlineUsers);
    });
});

// app.get('/get-all-sockets', (req, res) => {
//     return res.json({
//         sockets: io.sockets.sockets.keys(),
//     });
// });

// app.listen(5001, (req, res)=>{
//     console.log(`Server Running ON PORT: 5001`);
// });

/// !The Wrong Way
// io.on("disconnect", (args)=>{
//     console.log("Socket Has Been Disconnected");
//     console.log("The Arguments Are: ", args);
// })

// console.log("Listen ON Port: 3000");