import React, { FunctionComponent, useEffect, useState, useRef } from 'react';
import './App.css';
import { Dash } from './dash/dash';

interface stockHistory {
  at: Date, 
  score: number
}

interface stock {
  name: string,
  value: Array<stockHistory>,
  status: number,
  updatedAt: Date
}

const App:FunctionComponent<{ initial?: Array<stock> }> = ({ initial = [] }) => {
  const [stox, setStoxData] = useState(initial);
  let ws = useRef(new WebSocket("ws://stocks.mnet.website/"));

  useEffect(() => {
      // ws.current = new WebSocket("ws://stocks.mnet.website/");
      ws.current.onopen = () => console.log("ws opened");
      ws.current.onclose = () => console.log("ws closed");

      return () => {
          ws.current.close();
      };
  }, []);

  useEffect(() => {
      if (!ws.current) return;

      ws.current.onmessage = e => {
          const message = JSON.parse(e.data);
          const obj = Object.fromEntries(message);
          Object.keys(obj).map((key) => {
            let dateNow = new Date()
            let stockData:stockHistory = {at: dateNow, score: 0.0};
            let currentObj:stock = { name: key, value: [], status: 0, updatedAt: dateNow};
            let tempData = [...stox]
            const exists = tempData.filter(o => o.name === key);
            if(exists[0]) {
              const data = exists[0];
              const len = data.value.length - 1;
              const latestValue = data.value[len].score;
              if(latestValue > obj[key]) {
                data.status = -1
              } else if(latestValue < obj[key]) {
                data.status = 1
              }
              stockData.score = obj[key];
              data.value.push(stockData)
              return setStoxData(tempData);
            } else {
              stockData.score = obj[key];
              currentObj.value.push(stockData);
              currentObj.status = 1
              return setStoxData(prevState => [...prevState, currentObj]);
            }
          })
      };
  }, [stox]);
  return (
    <div className="App">
      <Dash props={stox}/>
    </div>
  );
}

export default App;
