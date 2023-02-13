const ThankYou = (props) => {

    const illustration = '../img/illustration-thank-you.svg'

    if (!props.show) {
        return null
    }

    return (
        <div>
            <section className="section">
                <div className="thankyou__container container">
                    <div className="thankyou__data">
                        { /*  Thank you state start */ }
                        <img src={illustration} alt="thankyou img" className="thankyou__img"/>

                        <p className="thankyou__subtext">You selected {props.choice} out of 5</p>
                    
                        <h2 className="thankyou__title">Thank you!</h2>
                    
                        <p className="thankyou__description">We appreciate you taking the time to give a rating. If you ever need more support, 
                        don't hesitate to get in touch!</p>
                    
                        { /* Thank you state end */ }
                    </div>
                    
                </div>
            </section>            
        </div>
    )
}

export default ThankYou