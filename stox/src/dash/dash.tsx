import React, { FunctionComponent } from 'react';
import './dash.css';
import { Sparklines, SparklinesLine,  SparklinesSpots} from 'react-sparklines';

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

export const Dash:FunctionComponent<{props:Array<stock>}> = (data) => {
    return (
        <div>
            <section>
                <h1>FINANCIAL DASHBOARD</h1>
                <div className="tbl-header">
                    <table cellPadding="0" cellSpacing="0">
                    <thead>
                        <tr>
                        <th>Ticker</th>
                        <th>Price</th>
                        <th>Last Update</th>
                        <th>Graph</th>
                        </tr>
                    </thead>
                    </table>
                </div>
                <div className="tbl-content">
                    <table cellPadding="0" cellSpacing="0">
                        <tbody>
                            { 
                                data.props.map((item, idx) => {
                                    let color = 'new';
                                    if(item.status === 1) {
                                        color = 'inc'
                                    } else if (item.status === 0) {
                                        color = 'new'
                                    } else {
                                        color = 'dec'
                                    }
                                    const diffTime: number = new Date().getTime() - item.updatedAt.getTime();
                                    const len = item.value.length - 1;
                                    const latestData = item.value[len];
                                    var dataArray = item.value.map(({ score }) => score);
                                    return (
                                        <tr key={idx} className={color}>
                                            <td>{item.name}</td>
                                            <td>$ {latestData.score.toFixed(2)}</td>
                                            <td>{diffTime <= 1000 ? 'Just now' : item.updatedAt.toLocaleString()}</td>
                                            <td>
                                                <Sparklines data={dataArray} limit={20}>
                                                    <SparklinesLine color="#1c8cdc" />
                                                    <SparklinesSpots />
                                                </Sparklines>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}