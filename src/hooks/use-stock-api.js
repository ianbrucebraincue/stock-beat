import { useState } from "react";
import axios from 'axios';

export default function StockAPI () {
    const stockSymbol = "AAPL";
    const dateString = "2023-09-13";
                            // remove all characters after and including second hyphen
    const monthYearString = dateString.replace(/(.*?-.*?)-.*/, '$1');
    const alphaVantageKey = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
    const apiUri = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockSymbol}&interval=30min&month=${monthYearString}&outputsize=full&apikey=${alphaVantageKey}`;

    const dataSet = [];
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    function Error({ error }) {
        if (error) {
          return <h1 className="error">{error.message}</h1>;
        }
    }

    function Loading({ loading }) {
        if (loading) {
          return <h2 className="loading">Loading...</h2>;
        }
    }

    function Data({ data, loading }) {
        // access all time series data for the month/year
        let dataLoaded = data["Time Series (30min)"];

        if (loading) {
            return (
                <ul>
                    <li>Yeah loading.</li>
                </ul>
            )
        } else if(!loading && dataLoaded) {
            // loop through each day and 30 min key
            for(const key in dataLoaded) {
                // if key has desired date, add to dataSet array for further use
                if(key.includes(dateString) ){
                    // add desired date data and data key type to array
                    dataSet.push(`${dataLoaded[key]["4. close"]}`);
                }        
            }

            // dataSet.splice(0, 5);
            // dataSet.splice(-10, 10);

            return (
                // print all relevant data to screen
                <ul>
                   {dataSet.map((data, index) => (
                   <li key={index}>{index}: {data}</li>
                   ))}
                </ul>
            );
        } else {
            return (
                <ul>
                    <li>No data.</li>
                </ul>
            )
        }
    }

    const fetchStockData = async () => {
        try {
            const response = await axios.get(apiUri);
            setData(response.data);
            setError(null);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    return (
        <> 
            <button onClick={fetchStockData}>Print {stockSymbol} stock info for {dateString}</button>
            <Error
             error={error}
            />
            <Loading 
            loading={loading}
            />
            <Data
            data={data}
            loading={loading}
            />
        </>
    );
}