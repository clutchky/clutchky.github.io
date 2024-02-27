import { useState } from "react";

const AddStockForm = ({ createStock }) => {

    const [newStock, setNewStock] = useState({
        tickerSymbol: "",
        price: ""
    });

    const addStock = (event) => {
        event.preventDefault();

        createStock({
            tickerSymbol: `$${(newStock.tickerSymbol).toUpperCase()}`,
            price: newStock.price,
            date: new Date()
        })

        setNewStock({ tickerSymbol: "", price: "" });
    }

    return (
        <div>
        <h3>Add a stock</h3>
        <form onSubmit={addStock}>
            <div>
            <label>Stock name: $ </label>
            <input onChange={(event) => setNewStock({...newStock, tickerSymbol: event.target.value})} type="text" name="tickerSymbol" value={newStock.tickerSymbol} />
            </div>
            <div>
            <label>Stock price: </label>
            <input onChange={(event) => setNewStock({...newStock, price: event.target.value})} type="text" name="price" value={newStock.price} />
            </div>
            <button>Add Stock</button>
        </form>
        </div>
    )
}

export default AddStockForm;