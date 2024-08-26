import React from "react";

import { useSelector, useDispatch } from 'react-redux';

import { Autocomplete, Card, CardContent, TextField, Typography } from "@mui/material";

import "./styles/masterJson.css";
import { changeMasterJson, selectMasterJson } from "./masterJsonSlice";
import { selectSelectedCollection } from './ragSlice';

const MASTER_JSON_TEMPLATES = [
    {label: "Summarize Template", id: "summarize_template"}, 
    {label: "File Inventory", id: "file_inventory"},
    {label: "Deponent List", id: "deponent_list"},
    {label: "Legal Analysis Prompt", id: "legal_analysis_prompt"},
    {label: "Simple Summary Prompt", id: "simple_summary_prompt"}
];

export const MasterJson = () => {
    const selectedCollection = useSelector(selectSelectedCollection);
    const selectedMasterJson = useSelector(selectMasterJson);
    const dispatch = useDispatch();

    const handleMasterJsonChange = (ev, selectedValue) => {
        dispatch(changeMasterJson({
            selectedTemplate: selectedValue
        }));
    };

    if (!selectedCollection) {
        return null;
    }

    return (
        <div className="master-json-section">
            <h3>Master Json</h3>
            <Card className="master-json-card">
                <CardContent className="master-json-card-content">
                    <Typography gutterBottom variant="h5" component="div"  style={{flexBasis: "30%"}}>
                        <strong>Select a Master Json</strong>
                    </Typography>
                    <div className="master-jsons">
                        <Autocomplete
                            disablePortal
                            options={MASTER_JSON_TEMPLATES}
                            sx={{ width: 300 }}
                            value={selectedMasterJson}
                            onChange={handleMasterJsonChange}
                            renderInput={(params) => <TextField {...params} label="Master Json" />}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}