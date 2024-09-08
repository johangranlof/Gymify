import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './WorkoutCalendar.css';
import workoutIcon from '../../Assets/Icons/workoutDone1.png';
import { isSameDay } from 'date-fns';

const WorkoutCalendar = ({ workouts }) => {
    const [date, setDate] = React.useState(new Date());

    return (
        <div className="calendar-container">
            <Calendar
                value={date}
                onChange={setDate}
                tileContent={({ date, view }) => {
                    if (view === 'month') {
                        const workoutsOnDate = workouts.filter(workout => 
                            isSameDay(new Date(workout.date), date)
                        );
                        return workoutsOnDate.length > 0 ? (
                            <div className='tile-content with-image'>
                                <img className='icon-image' src={workoutIcon} alt="Workout"/>
                            </div>
                        ) : null;
                    }
                    return null;
                }}
                tileClassName={({ date, view }) => {
                    if (view === 'month') {
                        if (isSameDay(new Date(), date)) {
                            return 'react-calendar__tile--today-highlight';
                        }
                        const workoutsOnDate = workouts.filter(workout => 
                            isSameDay(new Date(workout.date), date)
                        );
                        return workoutsOnDate.length > 0 ? 'react-calendar__tile--with-image' : null;
                    }
                    return null;
                }}
                locale="en-US"
            />
        </div>
    );
};

export default WorkoutCalendar;
