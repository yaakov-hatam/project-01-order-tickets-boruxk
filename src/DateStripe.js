import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { TiMediaFastForwardOutline, TiMediaRewindOutline } from 'react-icons/ti';
import { BusRides } from './Rides';
import { container, ACTIONS } from "./store";
import "react-datepicker/dist/react-datepicker.css";
import _ from 'lodash';
import {Day} from './Day';

export const DateStripe = () => {
    const [requestedData, setRequestedData] = useState();
    const [days7, setDays7] = useState([]);
    const [price7, setPrice7] = useState([]);
    const [noPrev, setNoPrev] = useState(false);
    const [noNext, setNoNext] = useState(false);
    container.subscribe(() => {
        const _requestedData = container.getState().requestedData;
        setRequestedData(_requestedData);
    });

    useEffect(() => {
        const temp = [];
        const tempP = [];
        let date = new Date();
        _.times(7, (i) => {
            if (requestedData && requestedData[0] !== undefined) {
                temp.push(requestedData[0].days[i]);
                tempP.push(requestedData[0].price[i]);
                setNoNext(true);
            } else {
                let options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
                let date2 = Intl.DateTimeFormat('en-En', options).format(date);
                temp.push(date2);
                const priceMin7 = [];
                const getPrices = (date) => {
                    for (let j = 0; j < 7; j++) {
                        let rides = [];
                        let priceMin = 0;
                        let tempPrice = [];
                        let year = date.getFullYear();
                        let month = date.getMonth() + 1;
                        let day = date.getDate();
                        let dateF = `${year}-${month}-${day}`;
                        BusRides.forEach(ride => {
                            if (dateF === ride.Date) {
                                rides.push(ride);
                            }
                        })
                        for (let i = 0; i < rides.length; i++) {
                            tempPrice.push(rides[i].Price);
                        }
                        priceMin = Math.min(...tempPrice);
                        tempP.push(priceMin);
                        setPrice7(priceMin7);
                        date.setDate(date.getDate() + 1);
                    }
                }
                getPrices(date);
                date.setDate(date.getDate() - 6);
            }
        });
        setPrice7(tempP);
        setDays7(temp);

    }, [requestedData])

    const prev7 = () => {
        const temp = [];
        const tempP = [];
        const day1 = requestedData[0].days[requestedData[0].days.indexOf(days7[0]) - 7];
        const pr1 = requestedData[0].price[requestedData[0].days.indexOf(days7[0]) - 7];
        if (days7[0] === requestedData[0].days[0]) {
            setNoPrev(false);
        } else {
            _.times(7, (i) => {
                temp.push(requestedData[0].days[requestedData[0].days.indexOf(day1) + i]);
                tempP.push(requestedData[0].price[requestedData[0].price.indexOf(pr1) + i]);
            });
            setDays7(temp);
            setPrice7(tempP);
            setNoNext(true);
        }
    }

    const next7 = () => {
        const temp = [];
        const tempP = [];
        const day7 = days7[6];
        const pr7 = price7[6];
        if (day7 === requestedData[0].days[27]) {
            setNoNext(false)
        } else {
            _.times(7, (i) => {
                temp.push(requestedData[0].days[requestedData[0].days.indexOf(day7) + i + 1]);
                tempP.push(requestedData[0].price[requestedData[0].price.indexOf(pr7) + i + 1]);
            });
            setDays7(temp);
            setPrice7(tempP);
            setNoPrev(true);
        }
    }

    const loadDay = (d) => {
        let newDate = new Date(d.currentTarget.children[0].children[0].children[0].textContent);
        const temp = [];
        let year = newDate.getFullYear();
        let month = newDate.getMonth() + 1;
        let day = newDate.getDate();
        let dateF = `${year}-${month}-${day}`;
        BusRides.forEach(ride => {
            if (!requestedData && dateF === ride.Date) {
                temp.push(ride);
            } else if (requestedData && requestedData[0] !== undefined && requestedData[0].departure === ride.Departure && requestedData[0].arrive === ride.ArriveTo && dateF === ride.Date) {
                temp.push(ride);
            } else if (requestedData && requestedData.length === 0 && dateF === ride.Date) {
                //requesteddata poyavlyaetsya ???????????
                temp.push(ride);
            }
        })
        container.dispatch(ACTIONS.SENDRIDES, {
            rides: temp
        });
        for (let i = 0; i < 7; i++) {
            d.currentTarget.parentElement.children[i].children[0].classList.remove('active');
        }
        let actualDay = d.currentTarget.children[0];
        actualDay.classList.add('active');
    }

    return (
        <div className="header2">
            <div className="row">
                <div className="col-md-1 day7 day7L">
                    <div onClick={noPrev ? prev7 : null} className={`${noPrev ? "orange" : "grey"}`}>
                        <h1>
                            <TiMediaRewindOutline />
                        </h1>
                        <h6>
                            Last 7
            </h6>
                    </div>
                </div>
                <div className="col-md-10">
                    <div className="row">
                        {days7.map((day, i) => (
                            <Day {...day} key={i} day={days7[i]} price={price7[i]} onClick={loadDay} />
                        ))}
                    </div>
                </div>
                <div className="col-md-1 day7 day7R">
                    <div onClick={noNext ? next7 : null} className={`${noNext ? "orange" : "grey"}`}>
                        <h1>
                            <TiMediaFastForwardOutline />
                        </h1>
                        <h6>
                            Next 7
          </h6>
                    </div>
                </div>
            </div>
        </div>
    )
}