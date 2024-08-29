import { useParams, useNavigate } from "react-router-dom";
import "./videocall.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useEffect, useRef, useState } from "react";
const VideoCall = () => {
  const { roomID } = useParams();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnection = useRef(null);
  const socketRef = useRef(null);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Initializing WebSocket connection
    socketRef.current = new WebSocket('ws://localhost:8080');
    const socket = socketRef.current;

    socket.onopen = () => {
      console.log('WebSocket connected');
      // Joining the room with a unique room ID
      socket.send(JSON.stringify({ type: 'join-room', roomID }));
    };
    //Handling all possible messages received from the WebSocket server
    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      switch (msg.type) {
        case 'offer':
          handleOffer(msg.offer);
          break;
        case 'answer':
          handleAnswer(msg.answer);
          break;
        case 'ice-candidate':
          handleNewICECandidateMsg(msg.candidate);
          break;
        case 'leave-call':
          closeConnection();
          break;
      }
    };

    //Permission to access the webcam and microphone
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setLocalStream(stream);
      // When local stream is obtained, setting up the peer connection
      setupPeerConnection(stream);
    });

    return () => {
      // Clean up on component unmount
      cleanupCall();
    };
  }, [roomID]);


  // Set up the peer connection and add the media stream tracks
  const setupPeerConnection = (stream) => {
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    peerConnection.current = new RTCPeerConnection(configuration);
    // Add each track from the local stream to the peer connection
    stream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, stream);
    });

    // Listen for remote stream
    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    // Listen for ice candidate events
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.send(
          JSON.stringify({
            type: 'ice-candidate',
            candidate: event.candidate,
            roomID,
          })
        );
      }
    };
  };

  // When receiving an offer, set it as the remote description, and create an answer
  const handleOffer = async (offer) => {
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);

    socketRef.current.send(
      JSON.stringify({
        type: 'answer',
        answer: answer,
        roomID,
      })
    );
  };

  // When receiving an answer, set it as the remote description
  const handleAnswer = async (answer) => {
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
  };

  // When receiving a new ICE candidate, add it to the peer connection
  const handleNewICECandidateMsg = async (candidate) => {
    try {
      await peerConnection.current.addIceCandidate(candidate);
    } catch (e) {
      console.error('Error adding received ice candidate', e);
    }
  };

  //Function that handles Cleanup on call end
  const cleanupCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null);
    }
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  // Close connection when the call is ended by the other user
  const closeConnection = () => {
    toast.info("Other User Left the Call, Redirecting to Home page!", {
      position: toast.POSITION.TOP_CENTER,
    });
    cleanupCall();
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  // To start the call, create an offer and set the local description, then send the offer to the peer
  const callUser = async () => {
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    socketRef.current.send(
      JSON.stringify({
        type: 'offer',
        offer: offer,
        roomID,
      })
    );
  };

  // Function that handles leaving the call
  const leaveCall = () => {
    // Send a message to the other peer so they can perform cleanup as well
    socketRef.current.send(JSON.stringify({
      type: 'leave-call',
      roomID: roomID,
    }));
    cleanupCall();
    navigate("/");
  };

  // Toggle the camera on/off
  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled; // Toggle the track status
      });
      setIsCameraOff(!isCameraOff);
    }
  };

  // Toggle the microphone on/off
  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled; // Toggle the track status
      });
      setIsMicMuted(!isMicMuted);
    }
  };

  return (
    <div>
      <div className="video-call-container">
        <video className="local-video" autoPlay playsInline ref={video => {
          // Attach the local stream to this video element when it's mounted
          if (video) video.srcObject = localStream;
        }} />
        {!remoteStream && <p className="noRemote">Start Call to connect with others in the room!</p>}
        <video className="remote-video" autoPlay playsInline ref={video => {
          // Attach the Remote stream to this video element when it's mounted
          if (video) video.srcObject = remoteStream
        }} />
      </div>

      <div id="controls">
        {!remoteStream && <button onClick={callUser} className="startCall">Start Call</button>}
        <div className={isCameraOff ? "OFF" : "control-container"} onClick={toggleCamera} id="camera-btn">
          <img src="/icons/camera.png" alt="Camera" />
        </div>
        <div className={isMicMuted ? "OFF" : "control-container"} onClick={toggleMic} id="mic-btn">
          <img src="/icons/mic.png" alt="Microphone" />
        </div>
        <div className="control-container" id="leave-btn" onClick={leaveCall}>
          <img src="/icons/phone.png" alt="Hang Up" />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
export default VideoCall;