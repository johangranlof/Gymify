import React, { useState, useEffect, useContext, useRef } from "react";
import "./LogWorkoutForm.css";
import Slider from "../Slider/Slider";
import ExerciseForm from "../ExerciseForm/ExerciseForm";
import axios from "axios";
import { AuthContext } from '../../services/AuthContext';
import ExerciseSearch from "../ExerciseSearch/ExerciseSearch";
import StopWatch from '../StopWatch/StopWatch';

const normalizeExercise = (exercise) => {
    return {
        id: exercise.id || null,
        name: exercise.name || '',
        muscleGroup: exercise.category || exercise.muscleGroup || '',
    };
};

const LogWorkoutForm = ({ exercises, onRemoveExercise, onAddExercise, setMessage, setMessageType, onWorkoutLogged }) => {
    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [notes, setNotes] = useState("");
    const [time, setTime] = useState(90);
    const { userId } = useContext(AuthContext);
    const [exerciseDetails, setExerciseDetails] = useState(exercises || []);
    const [useStopWatch, setUseStopWatch] = useState(false);
    const exerciseDetailsRef = useRef(exerciseDetails);


    useEffect(() => {
        exerciseDetailsRef.current = exerciseDetails;
    }, [exerciseDetails]);

    const handleSliderChange = (newValue) => {
        setTime(newValue);
    };

    const handleExerciseChange = (index, details) => {
        setExerciseDetails(prevDetails => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index] = { ...updatedDetails[index], ...details };
            return updatedDetails;
        });
    };

    const handleAddExercise = (exercise) => {
        const normalizedExercise = normalizeExercise(exercise);
        setExerciseDetails(prevExercises => [...prevExercises, normalizedExercise]);
        onAddExercise(normalizedExercise);
    };

    const handleRemoveExercise = (index) => {
        const updatedDetails = exerciseDetails.filter((_, i) => i !== index);
        setExerciseDetails(updatedDetails);
        onRemoveExercise(index);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const workout = {
            userId,
            date,
            notes,
            time: useStopWatch ? time : 90,
            workoutExercises: exerciseDetailsRef.current.map(details => ({
                exerciseId: details.exerciseId,
                sets: details.sets,
                reps: details.repetitions,
                weight: details.weight
            })),
        };
    
        await saveWorkout(workout);
    };
    

    const saveWorkout = async (workout) => {
        try {
            const exerciseIdMap = {};
    
            for (const details of exerciseDetails) {
                const normalizedExercise = normalizeExercise(details);
                const exerciseResponse = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/exercise`, {
                    name: normalizedExercise.name,
                    muscleGroup: normalizedExercise.muscleGroup
                });
                exerciseIdMap[normalizedExercise.name] = exerciseResponse.data.id;
            }
    
            const workoutExercises = exerciseDetails.map(details => ({
                exerciseId: exerciseIdMap[details.name],
                sets: details.sets,
                reps: details.repetitions,
                weight: details.weight
            }));
    
            await axios.post(`${process.env.REACT_APP_BASE_URL}/api/workout`, {
                userId: workout.userId,
                date: workout.date,
                notes: workout.notes,
                time: workout.time,
                workoutExercises: workoutExercises
            });
    
            setExerciseDetails([]);
            onRemoveExercise();
            setMessageType("success");
            setMessage("Workout saved successfully");
            onWorkoutLogged();
        } catch (error) {
            setMessageType("error");
            setMessage(error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="container-box">
            <form className="inputs" onSubmit={handleSubmit}>
                <div className='workout-input'>
                    <input
                        placeholder='Note'
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>
                <div className='workout-input'>
                    <input
                        placeholder='Date'
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <div className='time-selection'>
                    <label className="radio-label">
                        <input 
                            type="radio" 
                            value="slider" 
                            checked={!useStopWatch} 
                            onChange={() => setUseStopWatch(false)} 
                        />
                        Set time
                    </label>
                    <label className="radio-label">
                        <input 
                            type="radio" 
                            value="stopwatch" 
                            checked={useStopWatch} 
                            onChange={() => setUseStopWatch(true)} 
                        />
                        Use Stopwatch
                    </label>
                </div>

                {useStopWatch ? (
                    <StopWatch onTimeUpdate={setTime} />
                ) : (
                    <Slider value={time} onChange={handleSliderChange} />
                )}

                <button className="submit-log" type="submit">Log Workout</button>
                <ExerciseSearch onAddExercise={handleAddExercise} />
                <div className="exercise-form-container">
                    {exerciseDetails.map((exercise, index) => (
                        <ExerciseForm 
                            key={index} 
                            exercise={exercise} 
                            onRemove={() => handleRemoveExercise(index)}
                            onChange={(details) => handleExerciseChange(index, details)}
                        />
                    ))}
                </div>
            </form>
        </div>
    );
};

export default LogWorkoutForm;
