import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './component/Header';
import LoginContainer from './Login';
import Sender from './Dashboard';

function MyRoutes(): React.ReactElement {
  return (
    <BrowserRouter>
      <Header>
        <Routes>
          <Route path="/" element={<LoginContainer />} />
          <Route path="/dashboard" element={<Sender />} />
        </Routes>
      </Header>
    </BrowserRouter>
  );
}

export default MyRoutes;