import React from 'react';

import Container from '@mui/material/Container';
import { Collections } from './collections';

import "./styles/rag.css";
import { Ingestion } from './ingestion';
import { Deletion } from './deletion';
import { Query } from './query';
import { Model } from './model';

export function Rag(props) {
    return (
        <Container className={props.className}>
            <Model />
            {/* <Collections model={selectedModel} />
            <Ingestion />
            <Deletion />
            <Query /> */}
        </Container>
    );
}