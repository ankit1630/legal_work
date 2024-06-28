
import React, { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { selectSelectedCollection, onSelectCollection, onCreateCollection, updateCollections, selectCollectionOptions, changeModel } from './ragSlice';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';

import './styles/collections.css';

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
            try {
                const response = await axios.post("api/get_all_collections", {
                    model_type: props.model
                });

                dispatch(updateCollections(response.data));
                dispatch(onSelectCollection(""));
                setFetchCollectionProgress(false);
            } catch (error) {
                console.error("error in fetching collection", error);
                // setFetchingCollectionError(true);
                dispatch(changeModel({
                    model: ""
                }));
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
        const response = await axios.post("api/create_collection", {
            model_type: props.model,
            collection_name: createCollectionDialog.collectionName
        });
        dispatch(onCreateCollection(createCollectionDialog.collectionName  + "_" + props.model.toLowerCase()));
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
        ev.stopPropagation();

        const updatedCollections = collectionOptions.filter((collection) => collection !== collectionToDelete);

        const response = await axios.post("api/delete_collection", {
            collection_name: collectionToDelete
        });

        dispatch(updateCollections(updatedCollections));

        console.log(collectionToDelete, selectedCollection);

        if (collectionToDelete === selectedCollection) {
            dispatch(onSelectCollection(""));
        }
    }

    const renderCollectionOptions = (option) => {
        return (
            <div className='collections-option' key={option.key}  onClick={(ev) => handleCollectionSelection(ev, option.key)}>
                <div>{option.key}</div>
                <div className='collections-option-delete' onClick={(ev) => handleCollectionDelete(ev, option.key)}><DeleteIcon /></div>
            </div>
        )
    };

    const inputprops = {
        dir: "auto"
    };

    return (
        <div className='collections-conatainer'>
            <Autocomplete
                disablePortal
                options={collectionOptions}
                sx={{ width: 300 }}
                value={selectedCollection}
                onChange={handleCollectionSelection}
                inputValue={inputValue}
                onInputChange={handleInputValueChange}
                renderInput={(params) => <TextField {...params} label="Collections" />}
                renderOption={renderCollectionOptions}
            />
            <Button 
                variant="contained" 
                size="small"
                onClick={openCreateCollectionDialog}
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
    );
}