import { useEffect, useState } from "react";
import stocksService from "./services/stocks";
import AddStockForm from "./components/AddStockForm";

const App = () => {

  const [stockList, setStockList] = useState([]);
  const [newStock, setNewStock] = useState({
    tickerSymbol: "",
    price: ""
  });
  const [searchedStock, setSearchedStock] = useState("");

  useEffect(() => {
    stocksService.getAll()
      .then(response => {
        const stocks = response.data;
        setStockList(stocks);
      })
  }, [])

  //filter searched stock
  const filteredStock = stockList.filter(s => s.tickerSymbol.toLowerCase().includes(searchedStock.toLowerCase()));

  const addNewStock = (event) => {
    event.preventDefault();

    const stockObject = {
      tickerSymbol: `$${(newStock.tickerSymbol).toUpperCase()}`,
      price: newStock.price,
      date: new Date()
    }

    const matchedStock = filteredStock.find(s => s.tickerSymbol === stockObject.tickerSymbol);

    if(matchedStock) {

      if(window.confirm(`${stockObject.tickerSymbol} already exists. Replace the price with a new one?`)) {
        stocksService.updateOne(matchedStock.id, stockObject)
        .then(response => {
          setStockList(stockList.map(s => s.id !== matchedStock.id ? s : response.data));
          setNewStock({ tickerSymbol: "", price: "" });
        })
      } else {
        setNewStock({
          tickerSymbol: "",
          price: ""
        })
      }
    } else {
      stocksService.create(stockObject)
      .then(response => {
        setStockList(stockList.concat(response.data));
        setNewStock({ tickerSymbol: "", price: "" });
      })
    }

  }

  const removeStock = (id) => {
    const stock = stockList.find(s => s.id === id);

    // using a window.confirm for now
    if (window.confirm(`Delete ${stock.tickerSymbol}?`)) {
      stocksService.removeOne(id)
        .then(response => {
          setStockList(stockList.filter(s => s.id !== stock.id));
          setNewStock({
            tickerSymbol: "",
            price: ""
          })
        })
    }
  }

  const handleSearch = (event) => {
    setSearchedStock(event.target.value);
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
      <div>
        <span>Search stock: </span>
        <input onChange={handleSearch}/>
      </div>
      <AddStockForm 
        addNewStock={addNewStock}
        handlePrice={handlePrice}
        handleTicker={handleTicker}
        newStock={newStock}
      />
      
      <ul>
        {filteredStock.map((s, index) =>
            <li key={index}>{s.tickerSymbol}: 
            {s.price} <button onClick={() => removeStock(s.id)} >delete</button>
            </li>
          )
        }
      </ul>
    </div>
  );
}

export default App;