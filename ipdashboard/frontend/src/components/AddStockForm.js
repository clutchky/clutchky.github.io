const AddStockForm = (props) => {

    const { addNewStock, handlePrice, handleTicker, newStock} = props;

    return (
        <div>
        <h3>Add a stock</h3>
        <form onSubmit={addNewStock}>
            <div>
            <label>Stock name: $ </label>
            <input onChange={handleTicker} type="text" name="tickerSymbol" value={newStock.tickerSymbol} required/>
            </div>
            <div>
            <label>Stock price: </label>
            <input onChange={handlePrice} type="text" name="price" value={newStock.price} required/>
            </div>
            <button>Add Stock</button>
        </form>
        </div>
    )
}

export default AddStockForm;