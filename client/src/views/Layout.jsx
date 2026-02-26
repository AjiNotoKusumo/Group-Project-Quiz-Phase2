import { Outlet } from "react-router";
import { useEffect, useRef, useState } from "react";
import bgMusic from "../assets/Aylex - Fun is Fun (freetouse.com).mp3";

export default function Layout() {
    const audioRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = 0.3; // Set volume to 30%
            
            // Try to autoplay
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Autoplay was prevented, wait for user interaction
                    const handleInteraction = () => {
                        audio.play();
                        document.removeEventListener('click', handleInteraction);
                    };
                    document.addEventListener('click', handleInteraction);
                });
            }
        }
    }, []);

    const toggleMute = () => {
        const audio = audioRef.current;
        if (audio) {
            audio.muted = !audio.muted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <>
            {/* Background Music */}
            <audio ref={audioRef} src={bgMusic} loop />

            {/* Mute/Unmute Button */}
            <button
                onClick={toggleMute}
                className="fixed bottom-6 left-6 z-50 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-105"
                title={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted ? "🔇" : "🔊"}
            </button>

            <Outlet />
        </>
    );
}