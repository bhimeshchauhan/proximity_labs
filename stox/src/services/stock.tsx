export const data = () => {
    const ws = new WebSocket('ws://stocks.mnet.website/');
    let message;
    ws.onopen = () => {
        // on connecting, do nothing but log it to the console
        console.log('connected');
    }

    ws.onmessage = evt => {
        // listen to data sent from the websocket server
        message = JSON.parse(evt.data);
    }

    ws.onclose = () => {
        console.log('disconnected');
        // automatically try to reconnect on connection loss
    }
    return message
}