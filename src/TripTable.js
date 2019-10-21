import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { TiArrowSortedDown, TiArrowSortedUp, TiArrowUnsorted } from 'react-icons/ti';
import { BusRides } from './Rides';
import { container} from "./store";
import "react-datepicker/dist/react-datepicker.css";
import {TableRow} from './TableRow';

export const TripTable = () => {
    const [ascP, setAscP] = useState(false);
    const [descP, setDescP] = useState(false);
    const [unsortedP, setUnsortedP] = useState(true);
    const [ascT, setAscT] = useState(false);
    const [descT, setDescT] = useState(false);
    const [unsortedT, setUnsortedT] = useState(true);
    const [requestedData, setRequestedData] = useState();
    const [newDay, setNewDay] = useState();
    const [chosenRides, setChosenRides] = useState([]);
    container.subscribe(() => {
        const _requestedData = container.getState().requestedData;
        setRequestedData(_requestedData);
        const _newDay = container.getState().newDay;
        setNewDay(_newDay);
    });

    useEffect(() => {
        let temp = [];
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let dateF = `${year}-${month}-${day}`;
        if (newDay && newDay[0] !== undefined) {
            temp = newDay[0].rides;
        } else {
            BusRides.forEach(ride => {
                if (!requestedData && dateF === ride.Date) {
                    temp.push(ride);
                } else if (requestedData && requestedData[0] !== undefined && requestedData[0].departure === ride.Departure && requestedData[0].arrive === ride.ArriveTo && requestedData[0].departureTime === ride.Date) {
                    temp.push(ride);
                }
            })
        }

        setChosenRides(temp);
    }, [requestedData, newDay])

    const onSortTime = () => {
        setChosenRides(chosenRides.sort((a, b) => {
            return new Date('1970/01/01 ' + a.DepartureTime) - new Date('1970/01/01 ' + b.DepartureTime);
        }));
        setUnsortedT(false);
        setDescT(false);
        setAscT(true);
        setUnsortedP(true);
        setDescP(false);
        setAscP(false);
    }

    const onSortTime2 = () => {
        setChosenRides(chosenRides.slice(0).sort((a, b) => {
            return new Date('1970/01/01 ' + b.DepartureTime) - new Date('1970/01/01 ' + a.DepartureTime);
        }));
        setAscT(false);
        setDescT(true);
        setUnsortedP(true);
        setDescP(false);
        setAscP(false);
    }

    const onSortPrice = () => {
        setChosenRides(chosenRides.slice(0).sort((a, b) => a.Price - b.Price)); // slice makes a copy of array, sorting not working without it
        setUnsortedP(false);
        setDescP(false);
        setAscP(true);
        setUnsortedT(true);
        setDescT(false);
        setAscT(false);
    }

    const onSortPrice2 = () => {
        setChosenRides(chosenRides.slice(0).sort((a, b) => b.Price - a.Price));
        setAscP(false);
        setDescP(true);
        setUnsortedT(true);
        setDescT(false);
        setAscT(false);
    }

    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <td>Departure
              {unsortedT ? <TiArrowUnsorted onClick={onSortTime} /> : null}
                            {ascT ? <TiArrowSortedUp onClick={onSortTime2} /> : null}
                            {descT ? <TiArrowSortedDown onClick={onSortTime} /> : null}
                        </td>
                        <td >Duration</td>
                        <td >Arrival</td>
                        <td >Operator<br /><div className={"grey2"}>rating</div></td>
                        <td >Bus ID</td>
                        <td >Price
              {unsortedP ? <TiArrowUnsorted onClick={onSortPrice} /> : null}
                            {ascP ? <TiArrowSortedUp onClick={onSortPrice2} /> : null}
                            {descP ? <TiArrowSortedDown onClick={onSortPrice} /> : null}
                            <br /><div className={"grey2"}>per person</div>
                        </td>
                        <td >Book</td>
                    </tr>
                </thead>
                <tbody>
                    {chosenRides.map(ride => (
                        <TableRow {...ride} key={ride.num} data={ride} />
                    ))}
                </tbody>
            </table>

        </div>
    )
}