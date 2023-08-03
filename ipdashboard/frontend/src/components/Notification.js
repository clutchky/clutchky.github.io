const Notification = ({ message }) => {

    if (message.notification === null) {
        return null;
    } 
    
    return (
        <div className={message.status}>
            {message.notification}
        </div>
    )
    
}

export default Notification;