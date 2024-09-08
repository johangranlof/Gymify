import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExerciseSearch.css';
import FavoriteExercisesDropdown from './FavoriteExercisesDropdown/FavoriteExercisesDropdown';
import addIcon from '../../Assets/Icons/icons8-add-48.png';

const ExerciseSearch = ({ onAddExercise }) => {
    const [buttonClicked, setButtonClicked] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [categories, setCategories] = useState([]);
    const [exerciseAdded, setExerciseAdded] = useState(false);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await axios.get('https://wger.de/api/v2/exercise/', {
                    params: {
                        limit: 1000,
                        language: 2,
                    }
                });
                const exerciseData = response.data.results;
                const uniqueExercises = [];
                const exerciseNames = new Set();

                exerciseData.forEach(exercise => {
                    if (!exerciseNames.has(exercise.name.toLowerCase())) {
                        uniqueExercises.push(exercise);
                        exerciseNames.add(exercise.name.toLowerCase());
                    }
                });

                setExercises(uniqueExercises);
            } catch (error) {
                console.error('Error fetching exercises:', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://wger.de/api/v2/exercisecategory/');
                setCategories(response.data.results);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchExercises();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = exercises
                .filter(exercise =>
                    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .slice(0, 50);
            setFilteredExercises(filtered);
        } else {
            setFilteredExercises([]);
        }
    }, [searchTerm, exercises]);

    useEffect(() => {
        if (exerciseAdded) {
            window.scrollTo(0, window.outerHeight);
            setExerciseAdded(false);
        }
    }, [exerciseAdded]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAddExerciseClick = (exercise) => {
        const exerciseWithCategory = {
            ...exercise,
            category: categories.find(cat => cat.id === exercise.category)?.name || 'Unknown'
        };
        onAddExercise(exerciseWithCategory);
        setSearchTerm('');
        setFilteredExercises([]);
        setButtonClicked(false);
        setExerciseAdded(true);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setButtonClicked(!buttonClicked);
    }

    return (
        <div className="exercise-search">
            <button className='search-button' onClick={handleSearch}>
                {buttonClicked ? 'Cancel' : 'Add Exercise'}
            </button>
            {buttonClicked && (
                <div className='wrap'>
                    <div className="exercise-search-dropdown w-100 mb-2">
                    <FavoriteExercisesDropdown onAddExercise={onAddExercise}/>
                        <input
                            type="text"
                            placeholder="Search exercises"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="form-control"
                        />
                        {filteredExercises.length > 0 && (
                            <ul className="dropdown-list">
                                {filteredExercises.map(exercise => (
                                    <li 
                                        key={exercise.id} 
                                        className="dropdown-item"
                                        onClick={() => handleAddExerciseClick(exercise)}
                                    >
                                        <img className='icon m-1' src={addIcon} alt="add-icon"/>
                                        {exercise.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExerciseSearch;
