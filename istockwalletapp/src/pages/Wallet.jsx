import React, { Component } from 'react';

class StockData extends Component {
  state = {
    data: null
  }

  componentDidMount() {
    const stockSymbol = 'ITUB4.SAO';
    const apiKey = 'EZL3XCWTMYZEL4MD';
    const interval = '1min';

    fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockSymbol}&interval=${interval}&apikey=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        // update the component's state with the data
        this.setState({ data });
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    const { data } = this.state;

    if (!data) {
      return <p>Loading...</p>;
    }

    return (
      <div>
        <h2>Stock Data</h2>
        <table>
          <thead>
            <tr>
                    <th>Date</th>
                    <th>Open</th>
                    <th>High</th>
                    <th>Low</th>
                    <th>Close</th>
                    <th>Volume</th>
                </tr>
            </thead>
        </table>
    </div>
  )
}
}
  export default StockData