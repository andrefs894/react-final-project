import Home from './Home';
import About from './About';
import Menu from './Menu';
import Reservations from './Reservations';
import { Route, Routes } from 'react-router-dom';
import { useReducer } from 'react';
import BookingConfirm from './BookingConfirm';

function Main() {

  const updateTimes = async (date) => {
    const response = await fetch(`http://localhost:3001/api/reservations/${date}`);
    const data = await response.json();

    if(data.length > 0) {
      const format = initializeTimes().map(obj => {
        if (data.includes(obj.hour)) {
          return { ...obj, isFree: false };
        } else {
          return obj;
        }
      });
      dispatch({
        type: 'update',
        payload: format
      })
    }
    else {
      dispatch({
        type: 'initialize'
      })
    }
  }

  const initializeTimes = () => {
    return [
      { hour: "17:00", isFree: true },
      { hour: "18:00", isFree: true },
      { hour: "19:00", isFree: true },
      { hour: "20:00", isFree: true },
      { hour: "21:00", isFree: true },
      { hour: "22:00", isFree: true },
    ]
  }

  const submitForm = async (form) => {
    const response = await fetch('http://localhost:3001/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'initialize':
        return initializeTimes()
      case 'update':
        return action.payload
      default:
        return state;
    }
  };

  const [availableTimes, dispatch] = useReducer(reducer, []);

  return (
      <main>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/reservations" element={<Reservations availableTimes={availableTimes} updateTimes={updateTimes} submitForm={submitForm} />} />
              <Route path="/reservations/confirmed" element={<BookingConfirm />} />
          </Routes>
      </main>
  )
}

export default Main