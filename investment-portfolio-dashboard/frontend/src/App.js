import Stock from "./components/Stock";
import { useEffect, useState } from "react";
import stockServices from "./services/stocks";

function App() {
  const [stocklist, setStockList] = useState([]);
  const [newStock, setNewStock] = useState("");
  const [newPrice, setNewPrice] = useState("");
  // const [viewedStock, setViewedStock] = useState(null);

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
    console.log("viewStockOf clicked");
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
      <div>
          <hr></hr>
          <p>Company name</p>
          <label htmlFor="year">Fiscal Year </label>
          <select name="year">
            <option value="2023">2023</option>
          </select>
          <p>Price:</p>
          <p>Sales Revenue:</p>
          <p>Cost of Revenue:</p>
          <p>Gross Profit:</p>
          <p>Operating Expenses:</p>
          <p>Operating Income:</p>
          <p>Interest Expenses:</p>
          <p>Income Taxes:</p>
          <p>Net Income:</p>
          <p>Earnings per share:</p>
          <p>P/E Ratio:</p>
          <p>Earnings Yield:</p>
          <p>GPM Ratio:</p>
          <p>OPM Ratio:</p>
          <p>NPM Ratio:</p>
          <p>EBIT:</p>
          <p>Other Income:</p>
          <p>Total Assets:</p>
          <p>Total Liabilities:</p>
          <p>Return on Equity:</p>
          <p>Current Assets:</p>
          <p>Current Liabilities:</p>
          <p>Short-term debts:</p>
          <p>Long-term debts:</p>
          <p>Current Ratio:</p>
          <p>Interest Coverage Ratio:</p>
          <p>Working Capital Debt Ratio:</p>
          <p>Operating Cashflow:</p>
          <p>Investing Cashflow:</p>
          <p>Financing Cashflow:</p>
          <p>Capital Expenditures:</p>
          <p>Free Cashflow:</p>
          <p>Cashflow &gt; Long-term debt?</p>
          <p>Dividend Yield:</p>
          <p>Total Dividends:</p>
          <p>Dividend Payout Ratio:</p>
      </div>

    </div>
  )
}

export default App;
