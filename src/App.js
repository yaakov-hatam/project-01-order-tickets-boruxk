import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import "react-datepicker/dist/react-datepicker.css";
import {Header} from './Header';
import {DateStripe} from './DateStripe';
import {TripTable} from './TripTable';

const App = () => {
  return (
    <div className="App">
      <div className="container">
        <div className="col-md-12">
          <Header />
          <DateStripe />
          <TripTable />
        </div>
      </div>
    </div>
  );
}

export default App;
