import React, { useState, useEffect, useContext, useMemo } from 'react';
import './SessionGraph.css';
import { AuthContext } from '../../services/AuthContext';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SessionGraph = () => {
    const { userId } = useContext(AuthContext);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [monthlyData, setMonthlyData] = useState([]);

    useEffect(() => {
        const fetchWorkouts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/workout/user/${userId}`);
                const data = response.data;
                processMonthlyData(data);
            } catch (error) {
                setError('Error fetching workouts. Please try again later.');
                console.error('Error fetching workouts:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchWorkouts();
        }
    }, [userId]);

    const processMonthlyData = (workouts) => {
        const monthlyCounts = Array(12).fill(0);

        workouts.forEach((workout) => {
            const workoutDate = new Date(workout.date);
            const month = workoutDate.getMonth();
            monthlyCounts[month]++;
        });

        setMonthlyData(monthlyCounts);
    };

    const chartData = useMemo(() => ({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Number of Workouts",
                data: monthlyData,
                borderColor: 'rgba(120, 179, 140, 1)',
                pointBackgroundColor: 'rgba(53, 79, 62, 1)',
                pointBorderColor: 'rgba(53, 79, 62, 1)',
                fill: false,
                tension: 0.2,
            },
        ],
    }), [monthlyData]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="graph-wrapper">
            {error ? (
                <p className="error-message">{error}</p>
            ) : (
                <div className="line-graph">
                    <Line data={chartData} />
                </div>
            )}
        </div>
    );
};

export default SessionGraph;
