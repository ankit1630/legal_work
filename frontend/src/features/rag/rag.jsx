import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import Container from '@mui/material/Container';
import { Collections } from './collections';

import { changeModel, changeSubModel, selectModel, selectSubModel} from './modelSlice';

import "./styles/rag.css";
import { Ingestion } from './ingestion';
import { Deletion } from './deletion';
import { Query } from './query';
import { Model } from './model';
import { MasterJson } from './masterJson';

export function Rag(props) {
    const selectedModel = useSelector(selectModel);

    return (
        <Container className={props.className}>
            <Model />
            <Collections model={selectedModel} />
            <MasterJson />
            <Ingestion />
            <Deletion />
            <Query />
        </Container>
    );
}