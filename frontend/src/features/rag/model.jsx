import React from "react";

import { useSelector, useDispatch } from 'react-redux';
import { changeModel, changeSubModel, selectModel, selectSubModel} from './modelSlice';
import { Autocomplete, Card, CardContent, TextField, Typography } from "@mui/material";

import "./styles/model.css";

const MODELS = [{label: "Model_1"}, {label: "Model_2"}, {label: "Model_3"}]
const SUB_MODELS = {
    "Model_1": [{label: "SubModel_11"}, {label: "SubModel_12"}, {label: "SubModel_13"}],
    "Model_2": [{label: "SubModel_21"}, {label: "SubModel_22"}, {label: "SubModel_23"}],
    "Model_3": [{label: "SubModel_31"}, {label: "SubModel_32"}, {label: "SubModel_33"}]
};

export const Model = () => {
    const selectedModel = useSelector(selectModel);
    const selectedSubModel = useSelector(selectSubModel);
    const dispatch = useDispatch();

    const handleModelChange = (ev, selectedValue) => {
        dispatch(changeModel({
            model: selectedValue
        }));
    };

    const handleSubModelChange = (Ev, selectedValue) => {
        dispatch(changeSubModel({
            subModel: selectedValue
        }));
    }

    const subModelEl = selectedModel ? (
        <div className="sub-models">
            <Autocomplete
                disablePortal
                options={SUB_MODELS[selectedModel.label]}
                sx={{ width: 300 }}
                value={selectedSubModel}
                onChange={handleSubModelChange}
                renderInput={(params) => <TextField {...params} label="Sub-Models" />}
            />
        </div>
    ) : null;

    return (
        <div className="model-section">
            <h3>Model Selection</h3>
            <Card className="model-card">
                <CardContent className="model-card-content">
                    <Typography gutterBottom variant="h5" component="div">
                        <strong>Select a Model</strong>
                    </Typography>
                    <div className="models">
                        <Autocomplete
                            disablePortal
                            options={MODELS}
                            sx={{ width: 300 }}
                            value={selectedModel}
                            onChange={handleModelChange}
                            renderInput={(params) => <TextField {...params} label="Models" />}
                        />
                    </div>
                    {subModelEl}
                </CardContent>
            </Card>
        </div>
    );
}