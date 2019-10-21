import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import "react-datepicker/dist/react-datepicker.css";

export const Day = (props) => {
    const [day, setDay] = useState();
    const [price, setPrice] = useState();
    useEffect(() => {
        let date = props.day;
        let newDate = date.slice(0, -6);
        setDay(newDate)
        if (props.price === Infinity) {
            setPrice(<div className={"orange2"}>no rides</div>)
        } else {
            setPrice(<div className={"orange2"}>${props.price}<span className={"raise"}>00</span>+</div>)
        }
    }, [props.day, props.price])

    return (
        <div className="col col-day" onClick={props.onClick}>
            <div className="card day">
                <div className="card-body" style={{ display: "block" }}>
                    <div className={"hidden"}>{props.day}</div>
                    <div className={"blue"}>{day}</div>
                    {price}
                </div>
            </div>
        </div>
    )
}