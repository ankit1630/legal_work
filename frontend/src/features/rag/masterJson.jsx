import React from "react";

import { useSelector, useDispatch } from 'react-redux';

import { Autocomplete, Card, CardContent, TextField, Typography } from "@mui/material";
import Button from '@mui/material/Button';

import "./styles/masterJson.css";
import { changeMasterJson, selectMasterJson } from "./masterJsonSlice";
import { selectSelectedCollection } from './ragSlice';
import { selectModel } from './modelSlice';
import axios from 'axios';
import { useState } from "react";

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
    const selectedModel = useSelector(selectModel);
    const dispatch = useDispatch();
    const [masterJsonState, setMasterJson] = useState({
        creationMsg: ""
    });

    const handleMasterJsonChange = (ev, selectedValue) => {
        dispatch(changeMasterJson({
            selectedTemplate: selectedValue
        }));
    };

    const onCreateMasterJsonClick = async () => {
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || "{}");
        const response = await axios.post("api/create_master_json_template", {
            templateId: selectedMasterJson.id,
            collectionId : selectedCollection.id + "_" + selectedModel.id,
            token: localStorage.getItem('token'),
            useremail: storedUserInfo.useremail
        });

        setMasterJson({
            creationMsg: response.data
        })
    }

    if (!selectedCollection) {
        return null;
    }

    const creationMsgEl = masterJsonState.creationMsg ? <div className="master-json-creation">{masterJsonState.creationMsg}</div> : null;

    return (
        <div className="master-json-section">
            <h3>Master Json</h3>
            <Card className="master-json-card">
                {creationMsgEl}
                <CardContent className="master-json-card-content">
                    <Typography gutterBottom variant="h5" component="div"  style={{flexBasis: "30%"}}>
                        <strong>Select a Master Json Template</strong>
                    </Typography>
                    <div className="master-jsons">
                        <div className="master-jsons-conatainer">
                        <Autocomplete
                            disablePortal
                            options={MASTER_JSON_TEMPLATES}
                            sx={{ width: 300 }}
                            value={selectedMasterJson}
                            onChange={handleMasterJsonChange}
                            renderInput={(params) => <TextField {...params} label="Master Json Template" />}
                        />
                        <Button 
                            variant="contained" 
                            size="small"
                            onClick={onCreateMasterJsonClick}
                            style={{width: "200px"}}
                        >
                            Create Template
                        </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}