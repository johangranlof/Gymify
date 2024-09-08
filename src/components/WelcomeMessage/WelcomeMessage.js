import React, { useContext, useEffect, useState } from 'react';
import './WelcomeMessage.css';
import { AuthContext } from '../../services/AuthContext';
import axios from 'axios';

const WelcomeMessage = () => {
    const { userId } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const date = new Date();
    const hour = date.getHours();

    const getGreeting = () => {
        if (hour >= 5 && hour < 10) {
            return "Good Morning";
        } else if (hour >= 10 && hour < 12) {
            return "Welcome";
        } else if (hour >= 12 && hour < 17) {
            return "Good Afternoon";
        } else if (hour >= 17 && hour < 24) {
            return "Good Evening";
        } else {
            return "Welcome";
        }
    };

    useEffect(() => {
        const hasSeenWelcomeMessage = sessionStorage.getItem('hasSeenWelcomeMessage');

        if (!hasSeenWelcomeMessage) {
            const fetchUser = async () => {
                try {
                    const user = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/user/${userId}`);
                    setUserData(user.data);
                    setIsVisible(true);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };
            fetchUser();

            const timer = setTimeout(() => {
                setIsVisible(false);
                sessionStorage.setItem('hasSeenWelcomeMessage', 'true');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [userId]);

    if (!isVisible || !userData) {
        return null;
    }

    return (
        <div className="welcome-message">
            {getGreeting()} {userData.name}
        </div>
    );
};

export default WelcomeMessage;
