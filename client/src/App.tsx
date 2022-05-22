import React, { Component, FC } from 'react';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';

import { ExchangeSchedule } from './components/ExchangeSchedule';
import { Header } from './components/Header';

import './App.css';

const App: FC = () => {
  const a = 'Hello World';

  return (
    <>
      <Header />
      <Container className="App" maxWidth="lg">
        <ExchangeSchedule />
      </Container>
    </>
  );
};

export default App;
