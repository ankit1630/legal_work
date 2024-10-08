import React, { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { selectSelectedCollection } from './ragSlice';
import { selectModel } from './modelSlice';

import axios from 'axios';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import './styles/ingestion.css';
import { selectIngestionModalState, updateIngestionModalState } from './ingestionSlice';
import { styled } from '@mui/material/styles';
import { selectMasterJson } from './masterJsonSlice';


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export const Ingestion = () => {
    const selectedCollection = useSelector(selectSelectedCollection);
    const { ingestionModalIsOpen, ingestionType } = useSelector(selectIngestionModalState);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileOrFolderIsSelected, setFileOrFolderIsSelected] = useState(false);
    const [fileUploadStatus, setFileIsUploading] = useState({
        fileIsUploading: false,
        isSuccess: false,
        isError: false,
        errorMsg: ""
    });
    const {fileIsUploading, isSuccess, isError, errorMsg} = fileUploadStatus;
    const model = useSelector(selectModel);
    const dispatch = useDispatch();

    if (!selectedCollection) {
        return null;
    }

    const handleIngestFile = () => {
        dispatch(updateIngestionModalState({
            ingestionModalIsOpen: true,
            ingestionType: "file"
        }));
    }

    const handleIngestFolder = () => {
        dispatch(updateIngestionModalState({
            ingestionModalIsOpen: true,
            ingestionType: "folder"
        }));
    }

    const handleClose = (ev, reason) => {
        setSelectedFile(null);
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;

        setFileOrFolderIsSelected(false);
        setFileIsUploading({
            fileIsUploading: false,
            isSuccess: false,
            isError: false
        });

        dispatch(updateIngestionModalState({
            ingestionModalIsOpen: false,
            ingestionType: ""
        }));
    }

    const handleUploadFileOrFolder = async () => {
        setFileIsUploading({
            fileIsUploading: true,
            isSuccess: false,
            isError: false
        });

        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || "{}");
        const formData = new FormData();

        formData.append("file", selectedFile);
        formData.append("model_type", model.id);
        formData.append("collection_name", selectedCollection.id);
        formData.append('token', localStorage.getItem('token'));
        formData.append('useremail', storedUserInfo.useremail);

        try {
            // await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await axios.post(`/api/upload_qdrant/${ingestionType}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            });
            
            setFileIsUploading({
                fileIsUploading: false,
                isSuccess: true,
                isError: false
            });
            setSelectedFile(null);
            console.log(response.data); // Do something with the response data
            dispatch(updateIngestionModalState({
                ingestionModalIsOpen: false,
                ingestionType: ""
            }));
          } catch (error) {
            setFileIsUploading({
                fileIsUploading: false,
                isSuccess: false,
                isError: true,
                errorMsg: error.response.data.error_msg
            });
          }
    }

    const handleFileOrFolderChange = (ev) => {
        setSelectedFile(ev.target.files[0]);
        setFileOrFolderIsSelected(true);
    }

    const selectedFileEl = selectedFile ? <div>{selectedFile.name}</div> : <div>Choose {ingestionType}</div>;
    const errorMsgEl = isError ? <span className='ingestion-file-upload-error'>({errorMsg})</span> : null;
    const allowedFileType = ingestionType === "file" ? ".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx,.json,.csv,.html" : ".zip";
    const fileUploadSuccessEl = fileUploadStatus.isSuccess ? <div className='ingestion-success'>
        Request for {ingestionType} ingestion is added into the sqs queue, once done you will get the confirmation notification
    </div> : null;

    return (
        <div className='ingestion-section'>
            <h3>Ingestion</h3>
            <Card className='ingestion-container'>
                {fileUploadSuccessEl}
                <CardHeader className='ingestion-container-header' title="File & Folder Ingestion" />
                <CardContent>
                    Description of Ingestion
                </CardContent>
                <CardActions>
                    <Button onClick={handleIngestFile}>Ingest File</Button>
                    <Button onClick={handleIngestFolder}>Ingest Folder (only .zip)</Button>
                </CardActions>
                <Dialog
                    open={ingestionModalIsOpen}
                    onClose={handleClose}
                    maxWidth='md'
                >
                    <DialogTitle>Upload {ingestionType} {errorMsgEl}</DialogTitle>
                    <DialogContent style={{ width: '600px' }}>
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        disabled={fileIsUploading}
                    >
                        {selectedFileEl}
                        <VisuallyHiddenInput type="file" onChange={handleFileOrFolderChange} accept={allowedFileType} />
                    </Button>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="oulined" onClick={handleClose} disabled={fileIsUploading}>Cancel</Button>
                        <Button 
                            variant='contained' 
                            onClick={handleUploadFileOrFolder} 
                            disabled={!fileOrFolderIsSelected || fileIsUploading}
                        >
                            Upload
                        </Button>
                    </DialogActions>
                </Dialog>
            </Card>
        </div>
    );
}