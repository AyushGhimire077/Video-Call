import React, { useContext, useEffect, useState, useRef } from "react";
import Sidebar from "./Sidebar";
import { SocketContext } from "../providers/SocketContext";
import { AuthContext } from "../providers/AuthContex";
import { useLocation, useNavigate } from "react-router-dom";
import incomingCall from "../assets/incomingCall.mp3";

const CallBox = () => {
  const location = useLocation();
  const clickedUser = location.state?.clickedUser;
  const { socket } = useContext(SocketContext);
  const { loggedUserId } = useContext(AuthContext);
  const [isIncoming, setIsIncoming] = useState(false);
  const [incomingCallData, setIncominCallData] = useState({});
  const navigate = useNavigate();

  // Persistent ringtone instance
  const ringtoneRef = useRef(new Audio(incomingCall));

  //loggedIn user id
  const caller = loggedUserId;
  //Receiver user id
  const receiver = clickedUser?._id;

  //handle accept call
  const handleAcceptCall = () => {
    if (incomingCallData && incomingCallData.roomId) {
      const roomId = incomingCallData.roomId;
      socket.emit("accept-call", { receiver: loggedUserId, roomId });

      stopRingtone(); // Stop ringtone on accept
      navigate(`/room/${roomId}`);
    }
  };

  //handle reject call
  const handleRejectCall = () => {
    stopRingtone(); // Stop ringtone on decline
    setIsIncoming(false);
  };

  // Register user on socket connection
  useEffect(() => {
    if (!socket) return console.log("Socket not initialized");

    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleAcceptCall);

    return () => {
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleAcceptCall);
    };
  }, [caller, socket]);

  //handle call
  const handleCallStart = () => {
    const roomId = Date.now().toString();
    socket.emit("call-request", { caller, receiver, roomId });
    navigate(`/room/${roomId}`);
  };

  //handle incoming call
  const handleIncomingCall = ({ caller, roomId }) => {
    if (caller && roomId) {
      setIsIncoming(true);
      setIncominCallData({ caller, roomId });
    }
  };

  // Play/stop ringtone on incoming call
  useEffect(() => {
    const ringtone = ringtoneRef.current;
    if (isIncoming) {
      ringtone.loop = true;
      ringtone.play().catch((err) => console.log("Ringtone play error:", err));
    } else {
      stopRingtone();
    }
  }, [isIncoming]);

  // Stop ringtone function
  const stopRingtone = () => {
    const ringtone = ringtoneRef.current;
    ringtone.pause();
    ringtone.currentTime = 0;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      {isIncoming ? (
        <div className="w-full bg-white rounded-2xl shadow-2xl p-8 animate-pulse-once">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Incoming Call</h1>
            <p className="text-gray-600 text-lg">
              <span className="font-semibold text-[#2E8A99]">
                {clickedUser?.userName}
              </span>{" "}
              is calling...
            </p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleAcceptCall}
                className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-lg transition-colors duration-300"
              >
                Accept
              </button>

              <button
                onClick={handleRejectCall}
                className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-lg transition-colors duration-300"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="m-auto bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Start Your Call
            </h1>
            <p className="text-gray-600 text-lg">
              Ready to connect with{" "}
              <span className="font-semibold text-[#2E8A99]">
                {clickedUser?.userName}
              </span>
              ?
            </p>

            <button
              onClick={handleCallStart}
              className="px-8 py-4 bg-gradient-to-r from-[#73C7C7] to-[#2E8A99] text-white rounded-xl font-semibold text-lg hover:scale-105 transform transition-all duration-300"
            >
              Start Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallBox;
