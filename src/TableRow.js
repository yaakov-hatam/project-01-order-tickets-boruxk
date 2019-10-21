import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import "react-datepicker/dist/react-datepicker.css";

export const TableRow = (props) => {
    const [freeSeats, setFreeSeats] = useState();
    const [seats, setSeats] = useState(true);
    // const [price, setPrice] = useState([]);
    useEffect(() => {
        if (props.data.totalSeats - props.data.takenSeats < 1) {
            setFreeSeats(`no free seats`);
        } else {
            setFreeSeats(`free seats: ${props.data.totalSeats - props.data.takenSeats}`);
        }
    }, [props.data.totalSeats, props.data.takenSeats]);
    const book = (seat) => {
        props.data.takenSeats++;
        setFreeSeats(`free seats: ${props.data.totalSeats - props.data.takenSeats}`);
        if (props.data.totalSeats - props.data.takenSeats < 1) {
            seat.currentTarget.parentElement.classList.add('red');
            seat.currentTarget.parentElement.classList.remove('green');
            setSeats(false);
        }
        /*
        if (props.data.returningDay) {
          container.dispatch(ACTIONS.SEND, {
            departure: props.data.ArriveTo,
            arrive: props.data.Departure,
            departureTime: props.data.ArrivalTime,
            startDay: props.data.Departure,
            returningDay: props.data.Departure,
            price: price
          });
        }*/
    }

    return (
        <tr>
            <td className={"big"}>{props.data.DepartureTime} <br /> <div className={"grey2"}>{props.data.Departure}</div></td>
            <td>{props.data.Duration}</td>
            <td className={"big"}>{props.data.ArrivalTime} <br /> <div className={"grey2"}>{props.data.ArriveTo}</div></td>
            <td><img src={props.data.Operator.logo} alt="operator"></img>{props.data.Operator.rating} <br /> {props.data.Features}</td>
            <td>{props.data.busId}</td>
            <td className={"orange2"}>${props.data.Price}<span className={"raise"}>00</span></td>
            <td className={"green"}>{freeSeats} <br />{seats ? <span className={"blue2"} onClick={book}>Book</span> : null}</td>
        </tr>
    )
}