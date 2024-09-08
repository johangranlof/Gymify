import React, { useEffect, useState } from "react";
import "./ExerciseForm.css";

const ExerciseForm = ({ exercise, onRemove, onChange}) => {
    const [repetitions, setRepetitions] = useState();
    const [sets, setSets] = useState();
    const [weight, setWeight] = useState();

    useEffect(() => {
        onChange({ repetitions, sets, weight});
    }, [repetitions, sets, weight]);

    return (
        <div className="container li-item justify-center">
            <h3 className="title">{exercise.name} ({exercise.muscleGroup})</h3>
            <div className="row align-items-center">
                <div className="col-md-10">
                    <div className="mb-2">
                        <input
                            className="form-control"
                            placeholder="Weight"
                            type="number"
                            min={0}
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <input
                            className="form-control"
                            placeholder="Sets"
                            type="number"
                            min={0}
                            value={sets}
                            onChange={(e) => setSets(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <input
                            className="form-control"
                            placeholder="Repetitions"
                            type="number"
                            min={0}
                            value={repetitions}
                            onChange={(e) => setRepetitions(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-2 d-flex justify-content-center">
                    <button
                        type="button"
                        onClick={onRemove}
                        className="remove-btn">
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExerciseForm;
