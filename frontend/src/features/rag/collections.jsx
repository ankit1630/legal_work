
import React, { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { selectSelectedCollection, onSelectCollection, onCreateCollection, updateCollections, selectCollectionOptions } from './ragSlice';
import { changeModel } from './modelSlice';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import { Card, CardContent, Typography } from "@mui/material";

import './styles/collections.css';

const formatCollection = (collections) => {
    return collections.map((collection) => ({label: collection.name, id: collection.id}));
}

export const Collections = (props) => {
    const [inputValue, setInputValue] = React.useState('');
    const [createCollectionDialog, setCreateCollectionModelValue] = React.useState({
        open: false,
        collectionName: ""
    });
    const [fetchCollectionInProgress, setFetchCollectionProgress] = useState(false);
    // const [fetchingCollectionError, setFetchingCollectionError] = useState(false);
    const selectedCollection = useSelector(selectSelectedCollection);
    const collectionOptions = useSelector(selectCollectionOptions);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCollections = async () => {
            console.log("fbdf")
            const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || "{}");
            if (!storedUserInfo?.useremail) {
                console.log("No user found");
            }

            try {
                console.log({
                    useremail: storedUserInfo.useremail,
                    token: localStorage.getItem('token')
                })
                const response = await axios.get("api/get_collection", {
                    params: {
                        useremail: storedUserInfo.useremail,
                        token: localStorage.getItem('token')
                    }
                });

                dispatch(updateCollections(formatCollection(response.data)));
                dispatch(onSelectCollection(""));
                setFetchCollectionProgress(false);
            } catch (error) {
                console.error("error in fetching collection", error);
                // setFetchingCollectionError(true);
                dispatch(updateCollections(["collection 1", "collection 2"]));
                setFetchCollectionProgress(false);
            } finally {
                setFetchCollectionProgress(false);
            }
        }

        if (props.model) {
            // setFetchingCollectionError(false);
            setFetchCollectionProgress(true);
            fetchCollections();
        }
    }, [props.model, dispatch])
    
    if (!props.model) {
        return null;
    }

    if (fetchCollectionInProgress || !collectionOptions) { 
        return <div>Fetching collections...</div>
    }

    const handleCollectionSelection = (ev, selectedValue) => {
        dispatch(onSelectCollection(selectedValue))
    }

    const handleInputValueChange = (ev, newInputValue) => {
        setInputValue(newInputValue);
    }

    const openCreateCollectionDialog = () => {
        setCreateCollectionModelValue({
            ...createCollectionDialog,
            open: true
        });
    }

    const handleNewCollectionNameChange = (ev) => {
        setCreateCollectionModelValue({
            ...createCollectionDialog,
            collectionName: ev.target.value
        });
    }

    const handleCreateCollectionBtnClick = async () => {
        // check for existing collection
        // New collection -> New_Collection
        // xhr for creating collection
        // axios("https://abc.com/createCollection").then()
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || "{}");
        const response = await axios.post("api/create_collection", {
            model: props.model.id,
            collectionName: createCollectionDialog.collectionName,
            token: localStorage.getItem('token'),
            useremail: storedUserInfo.useremail
        });
        dispatch(onCreateCollection({id: response.data.id, label: createCollectionDialog.collectionName}));
        handleClose();
    }

    const handleClose = (ev, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
        
        setCreateCollectionModelValue({
            open: false,
            collectionName: ""
        });
    }

    const handleCollectionDelete = async (ev, collectionToDelete) => {
        console.log(collectionToDelete);
        ev.stopPropagation();

        const updatedCollections = collectionOptions.filter((collection) => collection.id !== collectionToDelete);

        // const response = await axios.post("api/delete_collection", {
        //     collection_name: collectionToDelete
        // });

        dispatch(updateCollections(updatedCollections));

        console.log(collectionToDelete, selectedCollection);

        if (collectionToDelete === selectedCollection) {
            dispatch(onSelectCollection(""));
        }
    }

    const renderCollectionOptions = (option, val) => {
        return (
            <div className='collections-option' key={option.id}  onClick={(ev) => handleCollectionSelection(ev, val)}>
                <div>{option.key}</div>
                <div className='collections-option-delete' onClick={(ev) => handleCollectionDelete(ev, val.id)}><DeleteIcon /></div>
            </div>
        )
    };

    const inputprops = {
        dir: "auto"
    };

    return (
        <div className='collection-section'>
            <h3>Collections</h3>
            <Card className="collection-card">
                <CardContent className="collection-card-content">
                    <Typography gutterBottom variant="h5" component="div" style={{flexBasis: "30%"}}>
                        <strong>Select/Manage Collection</strong>
                    </Typography>
                    <div className="collections">
                        <div className="collections-conatainer">
                            <Autocomplete
                                disablePortal
                                options={collectionOptions}
                                sx={{ width: 300 }}
                                value={selectedCollection}
                                onChange={handleCollectionSelection}
                                inputValue={inputValue}
                                onInputChange={handleInputValueChange}
                                renderInput={(params) => {
                                    return (<TextField {...params} label="Collections" />);
                                }}
                                renderOption={renderCollectionOptions}
                            />
                            <Button 
                                variant="contained" 
                                size="small"
                                onClick={openCreateCollectionDialog}
                                style={{width: "200px"}}
                            >
                                Create Collection
                            </Button>
                            <Dialog
                                open={createCollectionDialog.open}
                                onClose={handleClose}
                                maxWidth='md'
                            >
                                <DialogTitle>Create Collection</DialogTitle>
                                <DialogContent style={{ width: '600px' }}>
                                    <TextField
                                        autoFocus
                                        required
                                        inputProps={inputprops}
                                        margin="dense"
                                        label="Create collection"
                                        fullWidth
                                        variant="standard"
                                        value={createCollectionDialog.collectionName}
                                        onChange={handleNewCollectionNameChange}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button variant="oulined" onClick={handleClose}>Cancel</Button>
                                    <Button 
                                        variant='contained' 
                                        onClick={handleCreateCollectionBtnClick} 
                                        disabled={!createCollectionDialog.collectionName}
                                    >
                                        Create
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}