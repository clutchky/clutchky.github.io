import Stock from "./components/Stock";
import { useEffect, useState } from "react";
import stockServices from "./services/stocks";
import ViewStock from "./components/ViewStock";

function App() {
  const [stocklist, setStockList] = useState([]);
  const [newStock, setNewStock] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [viewedStock, setViewedStock] = useState(null);

  useEffect(() => {
    stockServices.getAll().then(res => {
      setStockList(res.data);
    })
  }, [])

  const addStock = (event) => {
    event.preventDefault();

    const newStockObject = {
      tickerSymbol: newStock,
      price: newPrice,
      id: stocklist.length + 1
    }

    stockServices.create(newStockObject)
      .then(res => {
        setStockList(stocklist.concat(res.data));
        setNewStock("");
        setNewPrice("");
      })
  }

  const deleteStock = (id) => {
    const stockQuote = stocklist.find(stock => stock.id === id);

    if (window.confirm(`Remove ${stockQuote.tickerSymbol}?`)) {

      stockServices.deleteStock(id)
        .then(() => {
          setStockList(stocklist.filter(stock => stock.id !== id));
        })

      window.alert(`${stockQuote.tickerSymbol} was removed.`);
    }
  }

  const handleNewStock = (event) => {
    setNewStock(event.target.value);
  }

  const handleNewPrice = (event) => {
    setNewPrice(event.target.value);
  }

  const viewStockOf = (id) => {
    console.log(`${viewedStock}`);
    setViewedStock(true);
  }

  const editStockOf = (id) => {
    console.log("editStock clicked");
  }

  return (
    <div>
      <h1>Investment Portfolio</h1>
      
      {/*Add new stock form*/}
      <h3>Add new stock</h3>

      <form onSubmit={addStock}>
        <div>
          stockquote: <input name="stockquote" value={newStock} onChange={handleNewStock} required />
        </div>
        <div>
          price: <input name="stockUrl" value={newPrice} onChange={handleNewPrice} required />
        </div>
        <button type="submit">Add</button>
      </form>
      {/*Stock list*/}
      <div>
        <h3> Stock list</h3>
        {stocklist.map(stock =>
          <Stock 
          key={stock.id}
          stock={stock}
          viewStock={() => viewStockOf(stock.id)}
          editStock={() => editStockOf(stock.id)}
          deleteStock={() => deleteStock(stock.id)}
          />
        )}
      </div>
      
      {viewedStock && <ViewStock />}

    </div>
  )
}

export default App;
