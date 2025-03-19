import { createContext, useCallback, useEffect, useMemo, useState } from "react";

const PeerContext = createContext();

const PeerContextProvider = ({ children }) => {

    const [remoteStream, setRemoteStream] = useState(null);

    const peer = useMemo(() => new RTCPeerConnection({
        iceServers: [{
            urls: [ "stun:stun.l.google.com:19302", "stun:global.stun.twilio.com:3478" ]
        }]
    }), []);


    //creating offer
    const createOffer = async () => {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        return offer;
    }

    //create answer 
    const createAnswer = async (offer) => {
        await peer.setRemoteDescription(offer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        return answer;
    }

    //setRemove ans
    const setRemoteAns = async (ans) => {
        await peer.setRemoteDescription(ans);
    }

    //connect each other stream
    const sendStream = async (stream) => {
        if(!stream) return;
        const tracks = stream.getTracks();
        for (const track of tracks) {
            peer.addTrack(track, stream);
        }
    }

    //listen for removte
    const handleTrackEvent = useCallback((ev) => {
        const streams = ev.streams;
        setRemoteStream(streams[0]);
    }, []);

    //handle negotiation

    useEffect(() => {
        peer.addEventListener("track", handleTrackEvent);
        return () => {
            peer.removeEventListener("track", handleTrackEvent);
        }
    }, [peer, handleTrackEvent]);


    const value = {
      peer,
      createOffer,
      createAnswer,
      setRemoteAns,
      sendStream,
      remoteStream,
    };

    return (
        <PeerContext.Provider value={value}>{children}</PeerContext.Provider>
    )
}


export { PeerContext, PeerContextProvider }