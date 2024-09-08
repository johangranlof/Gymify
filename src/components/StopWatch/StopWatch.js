import React, { useState, useEffect, useRef } from "react";
import "./StopWatch.css";

const Stopwatch = ({ onTimeUpdate }) => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const startTimeRef = useRef(null);
    const previousTimeRef = useRef(0);
    const animationFrameRef = useRef(null);

    const updateTime = (timestamp) => {
        if (startTimeRef.current === null) {
            startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current + previousTimeRef.current;
        setTime(elapsed);

        animationFrameRef.current = requestAnimationFrame(updateTime);
    };

    useEffect(() => {
        if (isRunning) {
            animationFrameRef.current = requestAnimationFrame(updateTime);
        } else {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            previousTimeRef.current = time;
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isRunning, time]);

    useEffect(() => {
        const minutes = Math.floor(time / 60000);
        onTimeUpdate(minutes);
    }, [time, onTimeUpdate]);

    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);

    const startAndStop = (e) => {
        e.preventDefault();
        setIsRunning(prev => !prev);
        if (!isRunning) {
            startTimeRef.current = null;
        }
    };

    const reset = (e) => {
        e.preventDefault();
        setTime(0);
        previousTimeRef.current = 0;
        onTimeUpdate(0);
    };

    return (
        <div className="stopwatch-container">
            <p className="stopwatch-time">
                {hours.toString().padStart(2, '0')}:
                {minutes.toString().padStart(2, '0')}:
                {seconds.toString().padStart(2, '0')}
            </p>
            <div className="stopwatch-buttons">
                <button className="stopwatch-button" onClick={startAndStop}>
                    {isRunning ? "Stop" : "Start"}
                </button>
                <button className="stopwatch-button" onClick={reset}>
                    Reset
                </button>
            </div>
        </div>
    );
};

export default Stopwatch;
