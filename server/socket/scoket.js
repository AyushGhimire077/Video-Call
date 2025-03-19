import { Server } from "socket.io";

// socket server
const io = new Server(4001, {
  cors: { origin: "http://localhost:5173", credentials: true},
});

//store all online users with register userId
let onlineUsers = new Map ();

const setUpSocket = async () => {
    io.on("connection", (socket) => {
        console.log("a user connected");

      //regsiter user using id with socket
      socket.on("registerUser", (userId) => {

        if (!userId) return;
        
          console.log("connnected user", userId);
  
          onlineUsers.set(userId, socket.id);
  
          console.log(`User with id ${userId} is registered with socket id${socket.id}`);
      })
        
      //Call Request
      socket.on("call-request", (data) => {
        const { caller, receiver, roomId } = data;

        //creating roomId
        
        const receiverSocketId = onlineUsers.get(receiver);
        if(!receiverSocketId) {
            return console.log("receiver is offline or found");
        }

        const receiverSocket = io.sockets.sockets.get(receiverSocketId);
        if(!receiverSocket) {
            return console.log("receiver is offline or found");
        }

        socket.join(roomId);

        receiverSocket.emit("incoming-call", { caller, roomId });

       console.log(`Call request from ${caller} to ${receiver}`);
      })


      //handle call accept
       socket.on("accept-call", ({ receiver, roomId }) => {
         const receiverSocketId = onlineUsers.get(receiver);
         if (!receiverSocketId) {
           return console.log("Receiver is offline or not found");
         }

         const receiverSocket = io.sockets.sockets.get(receiverSocketId);
         if (!receiverSocket) {
           return console.log("Receiver's socket instance is not found");
         }

         // Receiver joins the room
         socket.join(roomId);
         receiverSocket.join(roomId);

         // Notify both parties that the call has been accepted
         io.to(roomId).emit("call-accepted", { receiver });

         console.log(`Call accepted by ${receiver}, Room ID: ${roomId}`);
       });
      
      //handle user call
      socket.on('call-user', (data) => {
        const { receiver, offer } = data;

        const fromUserId = socket.id;
  

        if (!fromUserId) {
          return console.log("User is not found");
        }
        onlineUsers.set(socket.id, fromUserId);


         const receiverSocketId = onlineUsers.get(receiver);
         if (!receiverSocketId) {
           return console.log("Receiver is offline or not found");
         }

        socket.to(receiverSocketId).emit("getting-request", { from: fromUserId, offer });
        console.log(`Calling user: ${fromUserId} to receiver: ${receiver}`);
      })


      socket.on("accepted-call", (data) => {
        const { from, ans } = data;
        console.log("From", from)
        console.log("Answer", ans)
        const receiverSocketId = onlineUsers.get(from);
        console.log("Receiver Socket Id", receiverSocketId)

        socket.to(receiverSocketId).emit("call-made", { ans });

      });


        //handle user disconnect
        socket.on("disconnect", () => {
           onlineUsers.forEach((socketId, userId) => {
             if (socketId === socket.id) {
               onlineUsers.delete(userId);
               console.log(`User with ID ${userId} disconnected`);
             }
           });
        });



    });
    
  return io;
};

export { setUpSocket };
