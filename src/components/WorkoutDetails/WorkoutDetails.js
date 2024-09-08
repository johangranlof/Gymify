import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WorkoutDetails.css';
import Title from '../Title/Title';
import exerciseLogo from '../../Assets/Icons/icons8-workout-48.png';
import muscleLogo from '../../Assets/Icons/icons8-muscle-99.png';
import dateLogo from '../../Assets/Icons/icons8-date-48.png';
import timeLogo from '../../Assets/Icons/icons8-time-100.png';
import noteLogo from '../../Assets/Icons/icons8-note-58.png';

const WorkoutDetails = ({ workout, onRemove }) => {
    const [workoutDetails, setWorkoutDetails] = useState(null);

    useEffect(() => {
        const fetchWorkoutDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/workout/${workout.id}`);
                setWorkoutDetails(response.data);
            } catch (error) {
                console.error('Failed to fetch workout details', error);
            }
        };
        if (workout) {
            fetchWorkoutDetails();
        }
    }, [workout]);

    if (!workoutDetails) {
        return <div className="loading">Loading workout details...</div>;
    }

    const removeWorkout = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/workout/${workout.id}`);
            onRemove();
        } catch (error) {
            console.error('Failed to remove workout', error);
        }
    };

    return (
        <div className="workout-details">
            <Title text="Workout Details" color="black" />
            <div className="details-container">
                <div className="details-header">
                    <p className="detail-item">
                        <img src={dateLogo} alt="Date" className="icon" />
                        {new Date(workoutDetails.date).toLocaleDateString()}
                    </p>
                    <p className="detail-item">
                        <img src={timeLogo} alt="Time" className="icon" />
                        {workoutDetails.time} minutes
                    </p>
                    <p className="detail-item">
                        <img src={noteLogo} alt="Notes" className="icon" />
                        {workoutDetails.notes || "No note"}
                    </p>
                    <button onClick={removeWorkout} className="remove-btn"></button>
                </div>
                
                {workoutDetails.workoutExercises && workoutDetails.workoutExercises.length > 0 ? (
                    <ul className="exercise-list">
                        {workoutDetails.workoutExercises.map((exercise, index) => (
                            <li key={index} className="exercise-item">
                                <div className="exercise-info">
                                    <div className="exercise-name">
                                        <img src={exerciseLogo} alt="Exercise" className="icon" />
                                        {exercise.exercise?.name}
                                    </div>
                                    <div className="muscle-group">
                                        <img src={muscleLogo} alt="Muscle Group" className="icon" />
                                        {exercise.exercise?.muscleGroup}
                                    </div>
                                </div>
                                <div className="exercise-details">
                                    <p><strong>Sets:</strong> {exercise.sets}</p>
                                    <p><strong>Reps:</strong> {exercise.reps}</p>
                                    <p><strong>Weight:</strong> {exercise.weight} kg</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-exercises">No exercises found for this workout.</p>
                )}
            </div>
        </div>
    );
};

export default WorkoutDetails;
