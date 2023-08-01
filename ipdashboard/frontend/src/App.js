import { useEffect, useState } from "react";
import stocksService from "./services/stocks";


const AddStockForm = (props) => {

  const { addNewStock, handlePrice, handleTicker} = props;

  return (
    <div>
      <h3>Add a stock</h3>
      <form onSubmit={addNewStock}>
        <div>
          <label>Stock name: </label>
          <input onChange={handleTicker} type="text" name="tickerSymbol" />
        </div>
        <div>
          <label>Stock price: </label>
          <input onChange={handlePrice} type="text" name="price" />
        </div>
        <button>Add Stock</button>
      </form>
    </div>
  )
}

const App = () => {

  const [stockList, setStockList] = useState([]);
  const [newStock, setNewStock] = useState({
    tickerSymbol: "test",
    price: 0
  });

  useEffect(() => {
    stocksService.getAll()
      .then(response => {
        const stocks = response.data;
        setStockList(stocks);
      })
  }, [])

  const addNewStock = (event) => {
    event.preventDefault();

    const stockObject = {
      tickerSymbol: newStock.tickerSymbol,
      price: newStock.price,
      date: new Date()
    }

    stocksService.create(stockObject)
      .then(response => {
        setStockList(stockList.concat(response.data));
        setNewStock({});
      })
  }

  const handleTicker = (event) => {
    event.preventDefault()
    setNewStock({...newStock, tickerSymbol: event.target.value});
  }

  const handlePrice = (event) => {
    event.preventDefault()
    setNewStock({...newStock, price: event.target.value})
  }
  

  return (
    <div>
      <h2>Investment Portfolio Dashboard</h2>
      <AddStockForm 
        addNewStock={addNewStock}
        handlePrice={handlePrice}
        handleTicker={handleTicker}
      />
      
      <ul>
        {stockList.map((s, index) =>
            <li key={index}>{s.tickerSymbol}: {s.price}</li>
          )}
      </ul>
    </div>
  );
}

export default App;
