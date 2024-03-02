import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import History from './pages/History';
import Header from './components/header/Header';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/history"
          element={
            <History searchTerms={[]} setSearchTerm={(term: string) => {}} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
