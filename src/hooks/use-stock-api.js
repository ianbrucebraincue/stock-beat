import { useState, useEffect } from "react";
import axios from 'axios';

export default function StockAPI () {
    const dateString = "2009-01-21";
    const stockSymbol = "IBM";
    const dataSet = [];
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiUri = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockSymbol}&interval=30min&month=2009-01&outputsize=full&apikey=${process.env.REACT_APP_API_KEY}`;

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
        let dataLoaded = data["Time Series (30min)"];

        if (loading) {
            return (
                <ul>
                    <li>Yeah loading.</li>
                </ul>
            )
        } else if(!loading && dataLoaded) {
            for(const key in dataLoaded) {
                if(key.includes(dateString) ){
                    dataSet.push(`${dataLoaded[key]["4. close"]}`);
                }         
            }
            return (
                <ul>
                   {dataSet.map((data, index) => (
                   <li key={index}>{data}</li>
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
      

    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await axios.get(apiUri);
              setData(response.data);
              setLoading(false);
            } catch (err) {
              setError(err);
              setLoading(false);
            }
        };
          
        fetchData();
    }, [apiUri]);

    return (
        <> 
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