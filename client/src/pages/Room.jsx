import React, { useCallback, useContext, useEffect, useState } from 'react'
import { SocketContext } from '../providers/SocketContext';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../providers/AuthContex';
import { PeerContext } from '../providers/Peer';
import ReactPlayer from 'react-player'

const Room = () => {
  const { socket } = useContext(SocketContext);
  const { roomId } = useParams();
  const { loggedUserId } = useContext(AuthContext);
  const { peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStream } = useContext(PeerContext);

  //for videos setting
  const [isMuted, setIsMuted] = useState(false);
  const [isRemoteMuted, setIsRemoteMuted] = useState(false);

  //streams state
  const [myStream, setMyStream] = useState(null);
  const [remoteId, setRemoteId] = useState(null);

  //listening socket events
  useEffect(() => { 
    if (!socket) return console.log("Socket not initialized");

    socket.on("call-accepted", handleJoin);

    socket.on("getting-request", handleRequest);

    socket.on("call-made", handleCallMade);   
    

    return () => {
      socket.off("call-accepted", handleJoin);
      
      socket.off("getting-request", handleRequest);

      socket.off("call-made", handleCallMade);
    }
  }, [socket, roomId, loggedUserId]);


  //handle user join
  const handleJoin = async (data) => {
    const { receiver } = data;
    console.log("Accepeted from", receiver);
    const offer = await createOffer()
    socket.emit("call-user", { receiver, offer });
    setRemoteId(receiver);
  }


  //handle call request
  const handleRequest = async (data) => {
    const { from, offer } = data;
    console.log("Call request from", offer);
    console.log("incomming call from", from);
    const ans = await createAnswer(offer);
    socket.emit("accepted-call", { from, ans });
    setRemoteId(from);
  }

  //handle call made
  const handleCallMade = useCallback(async (data) => {
    console.log("Call get accept");
    const { ans } = data;
    console.log("Call get accept",ans);
    await setRemoteAns(ans);
  }, [setRemoteAns])
  

  //get user media stream
  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setMyStream(stream);
    sendStream(myStream);
    
  }, [myStream, sendStream])

  const handleNegotiation = useCallback(async () => {
    const localOffer = peer.localDescription;
    socket.emit("call-user", { receiver: remoteId, offer: localOffer });
  }, [peer.localDescription, remoteId, socket]);
  
     
  useEffect(() => {
    peer.addEventListener("negotiationneeded", handleNegotiation);
    return () => {
      peer.removeEventListener("negotiationneeded", handleNegotiation);
    }
  },[handleNegotiation, peer])

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream])
  

  //for videos setting
  const toggleMute = () => {
    if (myStream) {
      myStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
      setIsMuted(!isMuted);
    }
  }

  const toggleRemoteMute = () => {
    if (remoteStream) {
      remoteStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
      setIsRemoteMuted(!isRemoteMuted);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Room Page</h1>
      <h4 className="text-xl text-center mb-8">Connected with {remoteId}</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
        {/* Local Video */}
        <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
          <ReactPlayer
            url={myStream}
            playing
            muted={isMuted}
            width="100%"
            height="100%"
            className="object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/50 text-white px-3 py-1 rounded">
            You
          </div>
        </div>

        {/* Remote Video */}
        <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
          <ReactPlayer
            url={remoteStream}
            playing
            muted={isRemoteMuted}
            width="100%"
            height="100%"
            className="object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/50 text-white px-3 py-1 rounded">
            {remoteId}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          onClick={toggleMute}
          className={`px-6 py-3 rounded-full font-semibold ${
            isMuted
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          } text-white transition-colors`}
        >
          {isMuted ? "Unmute Me" : "Mute Me"}
        </button>

        <button
          onClick={toggleRemoteMute}
          className={`px-6 py-3 rounded-full font-semibold ${
            isRemoteMuted
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          } text-white transition-colors`}
        >
          {isRemoteMuted ? "Unmute Remote" : "Mute Remote"}
        </button>
      </div>
    </div>
  );
}

export default Room
