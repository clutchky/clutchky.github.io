const Stock = ({stock, editStock, deleteStock, viewStock}) => {

    return (
        <li key={stock.id}>
            {stock.tickerSymbol} {stock.price}&nbsp;
            <button onClick={viewStock}>View</button> 
            <button onClick={editStock}>Edit</button>
            <button onClick={deleteStock}>Delete</button>
        </li>
    )
}

export default Stock