import React, { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { selectSelectedCollection } from './ragSlice';
import { selectModel } from './modelSlice';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import axios from 'axios';

import './styles/deletion.css';
import { List, ListItem, ListItemText } from '@mui/material';

export const Deletion = () => {
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || "{}");
    const selectedCollection = useSelector(selectSelectedCollection);
    const model = useSelector(selectModel);
    const [deletionModalState, setDeletionModalState] = useState(false);
    const [deletionType, setDeletionType] = useState("");
    const [fileList, setFileList] = useState([]);
    const [fetchFileIsInProgress, setFetchFileProgress] = useState(false);
    const [fileDeleteInProgress, setFileDeleteProgress] = useState(false);
    const [fileDeletionError, setFileDeletionError] = useState("");

    useEffect(() => {
        const fetchFilesorFolder = async () => {
          const response = await axios.get("api/get_assest", {
            params: {
                collection_name: selectedCollection.id + "_" + model.id,
                token: localStorage.getItem('token'),
                useremail: storedUserInfo.useremail,
                assestType: deletionType
            }
          });
          setFileList(response.data);
          setFetchFileProgress(false);
        }

        if (deletionType) {
            setFetchFileProgress(true);
            fetchFilesorFolder();
            setFileDeletionError("");
        }
    }, [deletionType, selectedCollection, storedUserInfo.useremail, model])

    if (!selectedCollection) {
        return null;
    }

    const handleFileDeletion = () => {
        setDeletionModalState(true);
        setDeletionType("file");
    };

    const handleFolderDeletion = () => {
        setDeletionModalState(true);
        setDeletionType("folder");
    }

    const handleClose = (ev, reason) => {
        setFileList([]);
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;

        setDeletionModalState(false);
        setDeletionType("");
    };

    const onDeleteFile = async (asset) => {
        if (fileDeleteInProgress) return;

        setFileDeleteProgress(true);
        const data = {
            fileId: asset.id,
            collection_name: asset.collection,
            token: localStorage.getItem('token'),
            useremail: storedUserInfo.useremail,
            model_type: model.id
        }

        try {
            const response = await axios.post(`api/delete_qdrant/${deletionType}`, data);
            if (!response.data) {
                console.error(asset.name, " not deleted");
                setFileDeletionError(asset.name + " not deleted")
            } else {
                setFileList(fileList.filter((file) => file.id !== asset.id));
                setFileDeletionError("")
            }
            setFileDeleteProgress(false);
        } catch (error) {
            console.log(error)
            setFileDeleteProgress(false);
            setFileDeletionError(asset.name + " not deleted")
        }
    }

    const errorMsgEl = null;
    const fileListItemEl = fileList.map((file) => {
        return (
            <ListItem 
                key={file.id}
                className='deletion-list-item'
                secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => onDeleteFile(file)}>
                      <DeleteIcon />
                    </IconButton>
                }
            >
                <ListItemText>{file.name}</ListItemText>
            </ListItem>
        );
    });

    let cardContentEl = null;
    if (fetchFileIsInProgress) {
        cardContentEl = <div>Loading....</div>;
    } else if (!fileList.length) {
        cardContentEl = <div>No {deletionType} to delete.</div>;
    } else {
        cardContentEl = <List>{fileListItemEl}</List>;
    }

    return (
        <div className='deletion-section'>
            <h3>Deletion</h3>
            <Card className='deletion-container'>
                <CardHeader className='deletion-container-header' title="File & Folder Deletion" />
                <CardContent>
                    Description of Deletion
                </CardContent>
                <CardActions>
                    <Button onClick={handleFileDeletion}>Delete File</Button>
                    <Button onClick={handleFolderDeletion}>Delete Folder</Button>
                </CardActions>
                <Dialog
                    open={deletionModalState}
                    onClose={handleClose}
                    maxWidth='md'
                    
                >
                    <DialogTitle>Delete {deletionType} {errorMsgEl}</DialogTitle>
                    <DialogContent style={{ width: '600px' }}>
                        {fileDeletionError ? <div className='file-deletion-error'>{fileDeletionError}</div> : null}
                        {cardContentEl}
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={handleClose}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Card>
        </div>
    )
}