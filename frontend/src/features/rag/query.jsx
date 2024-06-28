import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import { selectModel, selectSelectedCollection } from './ragSlice';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

import axios from 'axios';

import './styles/query.css';
import { Checkbox } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export const Query = () => {
    const selectedCollection = useSelector(selectSelectedCollection);
    const model = useSelector(selectModel);
    const [queryText, setQueryText] = useState("");
    const [queryPrompt, setQueryPrompt] = useState("");
    const [sourceCount, setSourceCount] = useState(1);
    const [resultIsAvailable, setResultIsAvailable] = useState(false);
    const [result, setResult] = useState("");
    const [resetMemory, setResetMemory] = useState(true);
    const [searchType, setSearchType] = useState("similarity");
    const [getXhrIsInProgress, setGetXhrStatus] = useState(false);

    if (!selectedCollection) {
        return null;
    }

    const onQueryTextChange = (ev) => {
        setQueryText(ev.target.value);
    };

    const onQueryPromptChange = (ev) => {
        setQueryPrompt(ev.target.value);
    };

    const onQuerySourceCntChnage = (ev) => {
        setSourceCount(ev.target.value);
    };

    const handleGetRelevantDocument = async () => {
        const data = {
            query: queryText,
            no_of_source: Number(sourceCount),
            user_prompt : queryPrompt,
            model_type : model,
            collection_name : selectedCollection,
            reset_memory: resetMemory,
            search_type: searchType
        }

        setGetXhrStatus(true);

        try {
            // await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await axios.post("api/get_relevant_docs", data);
            console.log(response.data);
            setResultIsAvailable(true);
            setResult(response.data);
        } catch (error) {
            console.error(error);
            setResultIsAvailable(true);
            setResult("");
        }

        setGetXhrStatus(false);
    };

    const handleGetAnswer = async () => {
        const data = {
            query: queryText,
            no_of_source: Number(sourceCount),
            user_prompt : queryPrompt,
            model_type : model,
            collection_name : selectedCollection,
            reset_memory: resetMemory,
            search_type: searchType
        }

        setGetXhrStatus(true);

        try {
            // await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await axios.post("api/get_answer", data);
            console.log(response.data);
            setResultIsAvailable(true);
            setResult(response.data);
        } catch (error) {
            console.error(error);
            setResultIsAvailable(true);
            setResult("Error in fetching answer!!!");
        }

        setGetXhrStatus(false);
    };

    const handleResetMemory = (ev) => {
        setResetMemory(ev.target.checked);
    };

    const handleSearchTypeChange = (ev) => {
        setSearchType(ev.target.value);
    };

    const resultEl = resultIsAvailable ? <pre>{JSON.stringify(result, null, 2)}</pre> : "";

    return (
        <Card className='query-container'>
            <CardHeader className='query-container-header' title="Query" />
            <CardContent>
                <div className='query-text'>
                    <div className="query-text-title">Write your query</div>
                    <textarea
                        dir="auto"
                        className="query-text-box" 
                        rows={12} 
                        placeholder='Jot down your query...'
                        value={queryText}
                        onChange={onQueryTextChange}
                    />
                </div>
                <div className='query-prompt'>
                    <div className="query-prompt-title">Prompt</div>
                    <textarea
                        dir="auto"
                        className="query-text-box"
                        rows={12}
                        placeholder='Jot down your promt...'
                        value={queryPrompt}
                        onChange={onQueryPromptChange}
                    />
                </div>
                <div className='query-source'>
                    <div className='query-source-cnt'>
                        <div className="query-source-cnt-title">Source count</div>
                        <input 
                            className="query-source-box" 
                            placeholder='No. of resources' 
                            value={sourceCount}
                            onChange={onQuerySourceCntChnage}
                        />
                    </div>
                    <FormControl className='query-source-search-type'>
                        <InputLabel id="demo-simple-select-label">Search type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={searchType}
                            label="Search type"
                            onChange={handleSearchTypeChange}
                        >
                            <MenuItem value={"similarity"}>Similarity</MenuItem>
                            <MenuItem value={"mmr"}>MMR</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        label="Reset memory"
                        control={
                            <Checkbox
                                checked={resetMemory}
                                onChange={handleResetMemory}
                            />
                        }
                    />
                </div>
            </CardContent>
            <CardActions className='query-action-btns'>
                <Button variant='contained' disabled={getXhrIsInProgress} onClick={handleGetRelevantDocument}>Get relevant documents</Button>
                <Button variant='contained' disabled={getXhrIsInProgress} onClick={handleGetAnswer}>Get answer</Button>
            </CardActions>
            <CardContent>
                {resultEl}
            </CardContent>
        </Card>
    )
}