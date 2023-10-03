import { useState, useEffect } from "react";
import axios from 'axios';
import Synthesizer from '../components/synthesizer';

export default function StockAPI () {
    const stockSymbol = "AAPL";
    const dateString = "2023-09-13";
                            // remove all characters after and including second hyphen
    const monthYearString = dateString.replace(/(.*?-.*?)-.*/, '$1');
    const alphaVantageKey = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
    const apiUri = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockSymbol}&interval=30min&month=${monthYearString}&outputsize=full&apikey=${alphaVantageKey}`;

    const [data, setData] = useState({});
    const [filteredData, setFilteredData] = useState([]);
    const [error, setError] = useState(null);

    function Error({ error }) {
        if (error) {
          return <h1 className="error">{error.message}</h1>;
        }
    }

    const fetchStockData = async () => {
        try {
            const response = await axios.get(apiUri);
            setData(response.data);
            setError(null);
        } catch (err) {
            setError(err);
        }
    };

    //after stock api data retrieved
    useEffect(() => {
        const apiData = data["Time Series (30min)"];
        let filtered = [];

        for(const key in apiData) {
            // if key has desired date, add to dataSet array for further use
            if(key.includes(dateString) ){
                // add desired date data and data key type to array
                filtered.push(`${apiData[key]["4. close"]}`);
            }        
        }
        
        // remove 730-530PM ET
        filtered.splice(0, 5);
        // remove 4-830AM ET
        filtered.splice(-10, 10);
        //set filtered data state from 9AM - 5PM
        setFilteredData(filtered.reverse());

      }, [data]);

    return (
        <> 
            <button onClick={fetchStockData}>Print {stockSymbol} stock info for {dateString}</button>
            <Error
             error={error}
            />
            <Synthesizer filteredApiData={filteredData}/>
             <ul>
                {filteredData.map((data, index) => (
                    <li key={index}>{index}: {data}</li>
                ))}
            </ul>
    </>
    );
}