import React, { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { selectModel, selectSelectedCollection } from './ragSlice';

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
    const selectedCollection = useSelector(selectSelectedCollection);
    const [deletionModalState, setDeletionModalState] = useState(false);
    const [deletionType, setDeletionType] = useState("");
    const [fileList, setFileList] = useState([]);
    const [fetchFileIsInProgress, setFetchFileProgress] = useState(false);
    const [fileDeleteInProgress, setFileDeleteProgress] = useState(false);

    useEffect(() => {
        const url = deletionType === "file" ? "api/get_all_filenames" : "api/get_all_folders"
        const fetchFilesorFolder = async () => {
          const response = await axios.post(url, {
            collection_name: selectedCollection
          });
          setFileList(response.data);
          setFetchFileProgress(false);
        }

        if (deletionType) {
            setFetchFileProgress(true);
            fetchFilesorFolder();
        }
    }, [deletionType, selectedCollection])

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
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;

        setDeletionModalState(false);
        setFileList([]);
        setDeletionType("");
    };

    const onDeleteFile = async (fileOrFolderName) => {
        if (fileDeleteInProgress) return;

        console.log("deleting", fileOrFolderName);
        setFileDeleteProgress(true);
        let url;
        let data;

        if (deletionType === "file") {
            url = "api/delete_file";
            data = { 
                filename: fileOrFolderName,
                collection_name: selectedCollection
            };
        } else {
            url = "api/delete_folder";
            data = { 
                folder_name: fileOrFolderName,
                collection_name: selectedCollection
            };
        }
        try {
            // await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await axios.post(url, data);
            console.log("res", response);
            if (!response.data) {
                console.error(fileOrFolderName, " not deleted");
            } else {
                console.log(response.data);
                setFileList(fileList.filter((file) => file !== fileOrFolderName));
            }
            setFileDeleteProgress(false);
        } catch (error) {
            console.error(error);
            setFileDeleteProgress(false);
        }
    }

    const errorMsgEl = null;
    const fileListItemEl = fileList.map((file) => {
        return (
            <ListItem 
                key={file}
                className='deletion-list-item'
                secondaryAction={
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                }
                onClick={() => onDeleteFile(file)}
            >
                <ListItemText>{file}</ListItemText>
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
                <DialogContent style={{ width: '600px' }}>{cardContentEl}</DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </Card>
    )
}