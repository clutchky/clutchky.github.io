const EditStock = (props) => {

    const { individualStock, addNewStock, handleTicker, handlePrice } = props;

    return (
        <div>
            <h3>Edit stock</h3>
            <br />
            <form onSubmit={addNewStock}>
                <div>
                    <label>Stock name: $ </label>
                    <input 
                        type="text"
                        name="tickerSymbol"
                        onChange={handleTicker}
                        value={individualStock.tickerSymbol}
                    />
                </div>
                <div>
                    <label>Stock price: </label>
                    <input
                        type="text"
                        name="price"
                        onChange={handlePrice}
                        value={individualStock.price}
                        />
                </div>
                <button>Update stock</button>
            </form>
        </div>
    )
}

export default EditStock;