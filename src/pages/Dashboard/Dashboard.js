import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import WorkoutList from '../../components/WorkoutList/WorkoutList';
import LogWorkoutForm from '../../components/LogWorkoutForm/LogWorkoutForm';
import Message from '../../components/Message/Message';
import './Dashboard.css';
import WorkoutDetails from '../../components/WorkoutDetails/WorkoutDetails';
import Stats from '../../components/Stats/Stats';
import SessionGraph from '../../components/SessionGraph/SessionGraph';
import WorkoutCalendar from '../../components/WorkoutCalendar/WorkoutCalendar';
import { AuthContext } from '../../services/AuthContext';
import TitleText from '../../components/Title/Title';
import WelcomeMessage from '../../components/WelcomeMessage/WelcomeMessage';

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState('history');
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("error");
    const [chosenWorkout, setChosenWorkout] = useState(null);
    const [workouts, setWorkouts] = useState([]);
    const { userId } = useContext(AuthContext);

    const fetchWorkouts = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/workout/user/${userId}`);
            const sortedWorkouts = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setWorkouts(sortedWorkouts);
        } catch (error) {
            setMessageType('error');
            setMessage('Error fetching workouts');
        }
    };

    useEffect(() => {
        fetchWorkouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const handleSectionChange = (section) => {
        setActiveSection(section);
        if (section === 'logWorkout') {
            setChosenWorkout(null);
        }
    };

    const handleAddExercise = (exercise) => {
        setSelectedExercises(prevExercises => [...prevExercises, exercise]);
    };

    const handleRemoveExercise = (index) => {
        setSelectedExercises(prevExercises => prevExercises.filter((_, i) => i !== index));
    };

    const handleWorkoutLogged = async () => {
        await fetchWorkouts();
        setActiveSection('history');
        setSelectedExercises([]);
    };

    const handleWorkoutRemoved = async () => {
        await fetchWorkouts(); 
        setChosenWorkout(null);
    };

    return (
        <>
            <Message message={message} setMessage={setMessage} type={messageType} />
            <div className="dashboard-wrapper">
                <div className='col-md-12'>
                    <div className='row'>
                        <div>
                            <div className='button-group'>
                                <button onClick={() => handleSectionChange('history')} className={`nav-button ${activeSection === 'history' ? 'active' : ''}`}>History</button>
                                <button onClick={() => handleSectionChange('logWorkout')} className={`nav-button ${activeSection === 'logWorkout' ? 'active' : ''}`}>Log Workout</button>
                                <button onClick={() => handleSectionChange('stats')} className={`nav-button ${activeSection === 'stats' ? 'active' : ''}`}>Stats</button>
                            </div>
                            <div className='content-area'>
                                {activeSection === 'history' && (
                                    <>
                                        <WelcomeMessage/>
                                        <TitleText text="Workout Sessions" color="black"/>
                                        <WorkoutCalendar workouts={workouts} />
                                        <SessionGraph />
                                        <WorkoutList 
                                            setChosenWorkout={setChosenWorkout} 
                                            workouts={workouts}
                                        />
                                        {chosenWorkout && (
                                            <WorkoutDetails workout={chosenWorkout} onRemove={handleWorkoutRemoved} />
                                        )}
                                    </>
                                )}
                                {activeSection === 'logWorkout' && (
                                    <>
                                        <TitleText text="Log your last workout" color="black"/>
                                        <LogWorkoutForm 
                                            exercises={selectedExercises} 
                                            onRemoveExercise={handleRemoveExercise} 
                                            onAddExercise={handleAddExercise}
                                            setMessage={setMessage}
                                            setMessageType={setMessageType}
                                            onWorkoutLogged={handleWorkoutLogged}
                                        />
                                    </>
                                )}
                                {activeSection === 'stats' && (
                                    <>
                                        <TitleText text="Stats" color="black"/>
                                        <Stats />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
