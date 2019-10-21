import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BusRides } from './Rides';
import Autocomplete from 'react-autocomplete';
import { container, ACTIONS } from "./store";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const Header = () => {
    //time
    const [stateDepT, setStateDepT] = useState(null);
    const [stateReturnT, setStateReturnT] = useState(null);
    //Departure autocomplete
    const [stateDep, setStateDep] = useState({ value: '' });
    const keysDeparture = ["Departure"];
    const filteredDeparture = BusRides.filter((s => o => (k => !s.has(k) && s.add(k))(keysDeparture.map(k => o[k]).join('|')))(new Set()));
    //ArriveTo autocomplete
    const [stateArr, setStateArr] = useState({ value: '' });
    const keysArriveTo = ["ArriveTo"];
    const filteredArriveTo = BusRides.filter((s => o => (k => !s.has(k) && s.add(k))(keysArriveTo.map(k => o[k]).join('|')))(new Set()));
    const matchStocks = (state, value) => {
        return (
            state.Departure.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
            state.ArriveTo.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
    }
    const [price, setPrice] = useState([]);

    useEffect(() => {
        if (stateDepT !== null) {
            const priceMin28 = [];
            const getPrices = (startDate) => {
                for (let j = 0; j < 28; j++) {
                    let rides = [];
                    let priceMin = 0;
                    let tempPrice = [];
                    let year2 = startDate.getFullYear();
                    let month2 = startDate.getMonth() + 1;
                    let day2 = startDate.getDate();
                    let startDateF = `${year2}-${month2}-${day2}`;
                    BusRides.forEach(ride => {
                        if (stateDep.value === ride.Departure && stateArr.value === ride.ArriveTo && startDateF === ride.Date) {
                            rides.push(ride);
                        }
                    })
                    for (let i = 0; i < rides.length; i++) {
                        tempPrice.push(rides[i].Price);
                    }
                    priceMin = Math.min(...tempPrice);
                    priceMin28.push(priceMin);
                    setPrice(priceMin28);
                    startDate.setDate(startDate.getDate() + 1);
                }
                stateDepT.setDate(stateDepT.getDate() - 28);
            }
            getPrices(stateDepT);
        }
    }, [stateDepT, stateArr.value, stateDep.value])

    const requestedData = () => {
        container.dispatch(ACTIONS.SEND, {
            departure: stateDep.value,
            arrive: stateArr.value,
            departureTime: stateDepT,
            startDay: stateDepT,
            returningDay: stateReturnT,
            price: price
        });
    }

    return (
        <div className="header">
            <h1>Bus Tickets</h1> <br />
            <div className="row">
                <div className="col-md-3">
                    <Autocomplete value={stateDep.value} wrapperStyle={{ position: 'relative', display: 'inline-block' }}
                        items={filteredDeparture}
                        getItemValue={item => item.Departure}
                        shouldItemRender={matchStocks}
                        onChange={(event, value) => setStateDep({ value })}
                        onSelect={value => setStateDep({ value })}
                        renderMenu={children => (<div className="menu">{children}</div>)}
                        renderItem={(item, isHighlighted) => (<div className={`item ${isHighlighted ? 'item-highlighted' : ''}`} key={item.busId} > {item.Departure ? item.Departure : null}</div>)}
                        inputProps={{ className: "form-control", placeholder: 'Leaving from', id: "departurePlace" }}
                    />
                </div>
                <div className="col-md-3">
                    <Autocomplete value={stateArr.value} wrapperStyle={{ position: 'relative', display: 'inline-block' }}
                        items={filteredArriveTo}
                        getItemValue={item => item.ArriveTo}
                        shouldItemRender={matchStocks}
                        onChange={(event, value) => setStateArr({ value })}
                        onSelect={value => setStateArr({ value })}
                        renderMenu={children => (<div className="menu">{children}</div>)}
                        renderItem={(item, isHighlighted) => (<div className={`item ${isHighlighted ? 'item-highlighted' : ''}`} key={item.busId} > {item.ArriveTo ? item.ArriveTo : null}</div>)}
                        inputProps={{ className: "form-control", placeholder: 'Going to', id: "arrivalPlace" }}
                    />
                </div>
                <div className="col-md-5">
                    <div className="row">
                        <div className="col-md-5">
                            <DatePicker dateFormat="yyyy-MM-dd" selectsStart selected={stateDepT} onChange={date => setStateDepT(date)} placeholderText="select date" className="form-control" minDate={new Date()} />
                        </div>
                        <div className="col-md-5">
                            <DatePicker dateFormat="yyyy-MM-dd" selectsEnd selected={stateReturnT} onChange={dateR => setStateReturnT(dateR)} placeholderText="return date" className="form-control" minDate={stateDepT} />
                        </div>
                    </div>
                </div>
                <div className="col-md-1">
                    <button type='button' value='Search' className="btn btn-search" onClick={requestedData}>Search</button>
                </div>
            </div>
        </div>
    )
}