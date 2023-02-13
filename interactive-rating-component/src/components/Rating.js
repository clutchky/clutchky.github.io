const Rating = ({show, setPage, setChoice, choice}) => {
    const star = "../img/icon-star.svg";

    const submitChoice = (e) => {
        e.preventDefault()

        choice && setPage('thankyou')

    }

    if (!show) {
        return null
    }


    return (
        <div>
        <section className="section">
            <div className="card__container container">
            {/*Rating state start */}
                <div className="card__data">
                    <img src={star} alt="card img" className="card__img" />

                    <h2 className="card__title">How did we do?</h2>
                
                    <p className="card__description">Please let us know how we did with your support request. All feedback is appreciated 
                    to help us improve our offering!</p>
                
                    <ul className="card__list">
                        <li className="card__list-item">
                            <button onClick={() => setChoice("1")}>1</button>
                        </li>

                        <li className="card__list-item">
                            <button onClick={() => setChoice("2")}>2</button>
                        </li>

                        <li className="card__list-item">
                            <button onClick={() => setChoice("3")}>3</button>
                        </li>

                        <li className="card__list-item">
                            <button onClick={() => setChoice("4")}>4</button>
                        </li>

                        <li className="card__list-item">
                            <button onClick={() => setChoice("5")}>5</button>
                        </li>
                    </ul>

                    <form onSubmit={submitChoice}>
                        <button type="submit" className="card__button">
                            Submit
                        </button>
                    </form>
            
                {/* Rating state end */}
                </div>
            </div>
        </section>
        </div>
    )
}

export default Rating