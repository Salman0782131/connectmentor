import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import SimplePeer from "simple-peer";

function VideoCall() {
  const [stream, setStream] = useState(null);
  const [signalData, setSignalData] = useState("");
  const [inputSignal, setInputSignal] = useState("");

  const myVideo = useRef(null);
  const partnerVideo = useRef(null);
  const peerRef = useRef(null); // ✅ better than useState for peer

  // 🔥 Start Call (Caller)
  const startCall = () => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      const signal = JSON.stringify(data);
      setSignalData(signal); // show in UI
      console.log("COPY THIS SIGNAL:", signal);
    });

    peer.on("stream", (remoteStream) => {
      partnerVideo.current.srcObject = remoteStream;
    });

    peerRef.current = peer;
  };

  // 🔥 Accept Call (Receiver)
  const acceptCall = () => {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      const signal = JSON.stringify(data);
      setSignalData(signal);
      console.log("SEND BACK SIGNAL:", signal);
    });

    peer.on("stream", (remoteStream) => {
      partnerVideo.current.srcObject = remoteStream;
    });

    peer.signal(JSON.parse(inputSignal)); // 👈 important

    peerRef.current = peer;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Video Call 🎥</h1>

      {/* Videos */}
      <div className="flex gap-6 mb-6">
        <Webcam
          audio
          ref={myVideo}
          className="w-80 rounded shadow"
          onUserMedia={(stream) => setStream(stream)}
        />

        <video
          ref={partnerVideo}
          autoPlay
          playsInline
          className="w-80 rounded shadow bg-black"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={startCall}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Start Call
        </button>

        <button
          onClick={acceptCall}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Accept Call
        </button>
      </div>

      {/* Signal Display */}
      <textarea
        value={signalData}
        readOnly
        placeholder="Your Signal (Copy this)"
        className="w-full max-w-lg p-2 border mb-3"
      />

      {/* Input Signal */}
      <textarea
        value={inputSignal}
        onChange={(e) => setInputSignal(e.target.value)}
        placeholder="Paste partner signal here"
        className="w-full max-w-lg p-2 border"
      />
    </div>
  );
}

export default VideoCall;