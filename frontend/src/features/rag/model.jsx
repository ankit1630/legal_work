import React from "react";

import { useSelector, useDispatch } from 'react-redux';
import { changeModel, changeSubModel, selectModel, selectSubModel} from './modelSlice';
import { Autocomplete, Card, CardContent, TextField, Typography } from "@mui/material";

import "./styles/model.css";
import { onSelectCollection } from "./ragSlice";

const MODELS = [{label: "OpenAi", id: "openai"}]
const SUB_MODELS = {
    "openai": [{label: "GPT 4"}]
};

export const Model = () => {
    const selectedModel = useSelector(selectModel);
    // const selectedSubModel = useSelector(selectSubModel);
    const dispatch = useDispatch();

    const handleModelChange = (ev, selectedValue) => {
        dispatch(changeModel({
            model: selectedValue
        }));

        if (!selectedValue) {
            dispatch(onSelectCollection(""));
        }
    };

    // const handleSubModelChange = (Ev, selectedValue) => {
    //     dispatch(changeSubModel({
    //         subModel: selectedValue
    //     }));
    // }

    // const subModelEl = selectedModel ? (
    //     <div className="sub-models">
    //         <Autocomplete
    //             disablePortal
    //             options={SUB_MODELS[selectedModel.label]}
    //             sx={{ width: 300 }}
    //             value={selectedSubModel}
    //             onChange={handleSubModelChange}
    //             renderInput={(params) => <TextField {...params} label="Sub-Models" />}
    //         />
    //     </div>
    // ) : null;

    return (
        <div className="model-section">
            <h3>Model Selection</h3>
            <Card className="model-card">
                <CardContent className="model-card-content">
                    <Typography gutterBottom variant="h5" component="div"  style={{flexBasis: "30%"}}>
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
                    {/* {subModelEl} */}
                </CardContent>
            </Card>
        </div>
    );
}