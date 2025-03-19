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
  },[getUserMediaStream])

  return (
    <div>
      <h1>Room Page:</h1>
      <h4>Connected wiht {remoteId}</h4>
      <button>Send my stream</button>
      <ReactPlayer url={myStream} width="100%" height="100%" playing />
      <ReactPlayer url={remoteStream} width="100%" height="100%" playing />
    </div>
  );
}

export default Room
