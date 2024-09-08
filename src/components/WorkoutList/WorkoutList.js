import React from 'react';
import './WorkoutList.css';
import weight from '../../Assets/weight.png';
import arrow from '../../Assets/Icons/icons8-arrow-right-64.png';

const WorkoutList = ({ setChosenWorkout, workouts }) => {
    const handleDetailsClicked = (workout) => {
        setChosenWorkout(workout);
        window.scrollTo(0, window.outerHeight);
    };

    return (
        <div className="workout-list-container mt-3">
            {workouts.length === 0 && <p>No workouts found. Log your first workout!</p>}
            {workouts.length > 0 && (
                <div className="list-group">
                    {workouts.map(workout => {
                        const date = new Date(workout.date);
                        const year = date.getFullYear();
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        const day = date.getDate().toString().padStart(2, '0');
                        
                        const formattedDate = `${year}-${month}-${day}`;
                        
                        return (
                            <div key={workout.id} className="list-group-item d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex align-items-center">
                                    <img className="weight-image me-3" src={weight} alt="weight-icon" />
                                    <p className="mb-0">{formattedDate}</p>
                                </div>
                                <button className="btn btn-link" onClick={() => handleDetailsClicked(workout)}>
                                    <img src={arrow} alt="Arrow icon" className="arrow-icon" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default WorkoutList;
