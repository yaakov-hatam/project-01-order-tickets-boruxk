export const ACTIONS = {
    'SEND': 'SEND',
    'SENDRIDES': 'SENDRIDES'
}

const createStore = (reducer) => {
    let internalState = { //model
        requestedData: [],
        newDay: []
    };
    const handlers = [];

    return {
        dispatch: (action, params) => {
            internalState = reducer(internalState, action, params);
            handlers.forEach(h => h());
        },
        subscribe: (h) => {
            handlers.push(h);
        },
        getState: () => internalState
    }
}

const reducer = (model, action, params) => {
    const updates = {
        "SEND": (model, params) => {
            model.requestedData = [];
            model.requestedData.push(params);

            const GetDateFormat = (date) => {
                var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                return Intl.DateTimeFormat('sv-SE', options).format(date);
            }
            let dateObj2 = new Date(params.departureTime);
            params.departureTime = GetDateFormat(dateObj2);
            let dateObj3 = new Date(params.returningDay);
            params.returningDay = GetDateFormat(dateObj3);

            const GetDateFormat2 = (date) => {
                var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
                return Intl.DateTimeFormat('en-En', options).format(date);
            }
            let days = [];
            for (let i = 0; i < 28; i++) {
                let day = params.startDay;
                days.push(day);
                let dateObj = new Date(days[i]);
                days[i] = GetDateFormat2(dateObj);
                day.setDate(day.getDate() + 1);
            }
            params.days = days;

            return model;
        },
        "SENDRIDES": (model, params) => {
            model.newDay = [];
            model.newDay.push(params);            
            return model;
        }
    }
    return updates[action](model, params);
}

export const container = createStore(reducer);