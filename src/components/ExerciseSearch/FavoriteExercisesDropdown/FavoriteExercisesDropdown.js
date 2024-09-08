import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../services/AuthContext';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import './FavoriteExercisesDropdown.css';
import addIcon from '../../../Assets/Icons/icons8-add-48.png';


const FavoriteExercisesDropdown = ({ onAddExercise }) => {
    const [favoriteExercises, setFavoriteExercises] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { userId } = useContext(AuthContext);

    useEffect(() => {
        const fetchFavoriteExercises = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BASE_URL}/api/workout/user/${userId}/exercises`
                );
                setFavoriteExercises(response.data);
            } catch (error) {
                console.error('Error fetching favorite exercises:', error);
            }
        };

        fetchFavoriteExercises();
    }, [userId]);

    const handleAddFavoriteExerciseClick = (exercise) => {
        onAddExercise(exercise);
        setIsDropdownOpen(false);
    };

    return (
        <Dropdown show={isDropdownOpen} onToggle={() => setIsDropdownOpen(!isDropdownOpen)}>
            <DropdownButton
                id="dropdown-basic-button"
                title="Pick from favorites"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="dropdown-button mb-2"
            >
                <div className="dropdown-menu-custom">
                    {favoriteExercises.length > 0 ? (
                        favoriteExercises.map(exercise => (
                            <Dropdown.Item
                                key={exercise.id}
                                onClick={() => handleAddFavoriteExerciseClick(exercise)}
                            >
                            <img className='icon m-1' src={addIcon} alt="add-icon"/>
                            {exercise.name}
                            </Dropdown.Item>
                        ))
                    ) : (
                        <Dropdown.Item disabled>No favorite exercises available</Dropdown.Item>
                    )}
                </div>
            </DropdownButton>
        </Dropdown>
    );
};

export default FavoriteExercisesDropdown;
