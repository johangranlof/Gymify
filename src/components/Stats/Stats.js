import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Form } from "react-bootstrap";
import "./Stats.css";
import { AuthContext } from "../../services/AuthContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Stats = () => {
    const [exercises, setExercises] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [graphType, setGraphType] = useState('weight');
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const { userId } = useContext(AuthContext);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/workout/user/${userId}/exercises`);
                setExercises(response.data);
                if (response.data.length > 0) {
                    setSelectedExercise(response.data[0]);
                }
            } catch (error) {
                console.error("Failed to fetch exercises", error);
            }
        };

        fetchExercises();
    }, [userId]);

    useEffect(() => {
        if (selectedExercise) {
            const fetchWorkoutExercises = async (exerciseId) => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/workout/user/${userId}`);
                    const allWorkoutExercises = response.data.flatMap(workout =>
                        workout.workoutExercises
                            .filter(we => we.exercise.id === exerciseId && we.reps > 5)
                            .map(we => ({
                                ...we,
                                workoutDate: new Date(workout.date)
                            }))
                    );

                    const getWeekAndYear = (date) => {
                        const start = new Date(date.getFullYear(), 0, 1);
                        const days = Math.floor((date - start) / (24 * 60 * 60 * 1000));
                        const weekNumber = Math.ceil((days + 1) / 7);
                        return `${date.getFullYear()}-W${weekNumber}`;
                    };

                    const weeklyData = allWorkoutExercises.reduce((acc, we) => {
                        const weekKey = getWeekAndYear(we.workoutDate);
                        if (!acc[weekKey]) {
                            acc[weekKey] = [];
                        }
                        acc[weekKey].push(we.weight);
                        return acc;
                    }, {});

                    const weeklyDataArray = Object.entries(weeklyData).map(([week, weights]) => ({
                        week,
                        weight: Math.max(...weights)
                    }));

                    const percentageChange = weeklyDataArray.map((item, index, arr) => {
                        if (index === 0) return { week: item.week, percentageChange: 0 };
                        const previousWeight = arr[index - 1].weight;
                        const currentWeight = item.weight;
                        return {
                            week: item.week,
                            percentageChange: ((currentWeight - previousWeight) / previousWeight) * 100
                        };
                    });

                    setChartData({
                        labels: weeklyDataArray.map(we => we.week),
                        datasets: [{
                            label: graphType === 'weight' ? 'Weight (kg)' : 'Percentage Change (%)',
                            data: graphType === 'weight'
                                ? weeklyDataArray.map(we => we.weight)
                                : percentageChange.map(pc => pc.percentageChange),
                            fill: false,
                            backgroundColor: 'rgba(189, 212, 165,1)',
                            borderColor: 'rgba(189, 212, 165,1)',
                        }]
                    });
                } catch (error) {
                    console.error("Failed to fetch workout exercises", error);
                }
            };

            fetchWorkoutExercises(selectedExercise.id);
        }
    }, [selectedExercise, graphType, userId]);

    const handleExerciseChange = (event) => {
        const exerciseId = parseInt(event.target.value, 10);
        const exercise = exercises.find(ex => ex.id === exerciseId);
        setSelectedExercise(exercise);
    };

    const handleGraphTypeChange = (event) => {
        setGraphType(event.target.value);
    };

    const renderChart = () => {
        if (!chartData.labels.length) return null;

        const options = {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Week',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: graphType === 'weight' ? 'Weight (kg)' : 'Percentage Change (%)',
                    },
                    beginAtZero: true,
                },
            },
        };

        return <Line data={chartData} options={options} />;
    };

    const getDescription = () => {
        if (graphType === 'weight') {
            return (
                <p>
                    This graph shows the maximum weight lifted for each exercise per week. 
                    Data points are collected from workouts where the number of reps is greater than 5. 
                    If the same exercise is logged multiple times in a workout, only the highest weight is considered.
                </p>
            );
        } else if (graphType === 'percentageChange') {
            return (
                <p>
                    This graph shows the percentage change in the maximum weight lifted for each exercise per week. 
                    The percentage change is calculated based on the highest weight lifted in the current week compared 
                    to the previous week. Only data with more than 5 reps is included, and in cases of multiple entries 
                    for the same exercise in a week, only the highest weight is considered.
                </p>
            );
        }
    };

    return (
        <div className="stats-container">
            <div className="row">
                <div className="col-md-12 mb-4">
                    {exercises.length > 0 ? (
                        <>
                            <div className="exercise-select">
                                <Form.Group controlId="exerciseSelect">
                                    <Form.Label>Select an Exercise:</Form.Label>
                                    <Form.Control as="select" onChange={handleExerciseChange}>
                                        {exercises.map((exercise) => (
                                            <option key={exercise.id} value={exercise.id}>
                                                {exercise.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="graph-select">
                                <Form.Group controlId="graphTypeSelect">
                                    <Form.Label>Select Graph Type:</Form.Label>
                                    <Form.Control as="select" onChange={handleGraphTypeChange}>
                                        <option value="weight">Weight Over Time</option>
                                        <option value="percentageChange">Percentage Change Over Time</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                                
                            <div className="exercise-details">
                                <h5>Latest Weight: {selectedExercise?.latest} kg</h5>
                                <h5>Personal Best: {selectedExercise?.personalBest} kg</h5>
                            </div>

                            <div className="chart-container">
                                {renderChart()}
                            </div>
                            
                            <div className="description">
                                {getDescription()}
                            </div>
                        </>
                    ) : (
                        <p style={{ fontSize: "14px", color: 'black' }}>No favorite exercises found. <br /> Log some workouts!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Stats;
