import React, { useEffect, useState } from 'react';
import './Message.css';

const Message = ({ message, setMessage, type = "error", duration = 5000 }) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        if (message) {
            setFadeOut(false);
            const timer1 = setTimeout(() => setFadeOut(true), duration - 1000);
            const timer2 = setTimeout(() => {
                setFadeOut(false);
                setMessage(null);
            }, duration);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
            };
        }
    }, [message, duration, setMessage]);

    if (!message) return null;

    return (
        <div className={`message ${type} ${fadeOut ? 'fade-out' : ''}`}>
            {message}
        </div>
    );
};

export default Message;
