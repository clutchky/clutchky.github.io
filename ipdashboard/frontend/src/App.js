import { useEffect, useState } from "react";
import stocksService from "./services/stocks";
import AddStockForm from "./components/AddStockForm";
import './styles.css'
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [stockList, setStockList] = useState(null);
  const [searchedStock, setSearchedStock] = useState("");
  const [message, setMessage] = useState({
    notification: "",
    status: ""
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    stocksService.getAll()
      .then(response => {
        const stocks = response.data;
        setStockList(stocks);
      })
  }, []);

  useEffect(() => {
    const loggedInvestorJSON = window.localStorage.getItem('loggedInvestor');
    if(loggedInvestorJSON) {
      const user = JSON.parse(loggedInvestorJSON);
      setUser(user);
      stocksService.setToken(user.token);
    }
  }, []);

  // do not render anything if stock list is still null
  if (!stockList) {
    return null
  }

  //filter searched stock
  const filteredStock = stockList.filter(s => s.tickerSymbol.toLowerCase().includes(searchedStock.toLowerCase()));

  const addNewStock = async (stockObject) => {

    const matchedStock = filteredStock.find(s => s.tickerSymbol === stockObject.tickerSymbol);

    if(matchedStock) {

      if(window.confirm(`${stockObject.tickerSymbol} already exists. Replace the price with a new one?`)) {
        try {
          const result = await stocksService.updateOne(matchedStock.id, stockObject);
          setStockList(stockList.map(s => s.id !== matchedStock.id ? s : result.data));
          setMessage({
            notification: `${stockObject.tickerSymbol}'s price was updated`,
            status: "success"
          });
          setTimeout(() => {
            setMessage({
              notification: "",
              status: ""
            })
          }, 5000);
        } catch (error) {
          setMessage({
            notification: `${stockObject.tickerSymbol} was already removed from server`,
            status: "error"
          });
          setTimeout(() => {
            setMessage({
              notification: "",
              status: ""
            })
          }, 5000);
          setStockList(stockList.filter(s => s.id !== matchedStock.id));
        }
      }
    } else {
      try {
        const result = await stocksService.create(stockObject)
        setStockList(stockList.concat(result));
        setMessage({
          notification: `${stockObject.tickerSymbol} was added`,
          status: "success"
        });
        setTimeout(() => {
          setMessage({
            notification: "",
            status: ""
          })
        }, 5000);
      } catch (error) {
        setMessage({
          notification: `${error.response.data.error}`,
          status: "error"
        });
        setTimeout(() => {
          setMessage({
            notification: "",
            status: ""
          })
        }, 5000);
      }
    }
  }

  const removeStock = (id) => {
    const stock = stockList.find(s => s.id === id);

    // using a window.confirm for now
    if (window.confirm(`Delete ${stock.tickerSymbol}?`)) {
      stocksService.removeOne(id)
        .then(response => {
          setStockList(stockList.filter(s => s.id !== stock.id));
          setMessage({
            notification: `${stock.tickerSymbol} was removed`,
            status: "success"
          });
          setTimeout(() => {
            setMessage({
              notification: "",
              status: ""
            })
          }, 5000);
        })
        .catch(error => { 
          setMessage({
            notification: `${stock.tickerSymbol} was already removed`,
            status: "error"
          });
          setTimeout(() => {
            setMessage({
              notification: "",
              status: ""
            })
          }, 5000);
          setStockList(stockList.filter(s => s.id !== stock.id))
        })
    }
  }

  const handleSearch = (event) => {
    setSearchedStock(event.target.value);
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      });

      window.localStorage.setItem(
        'loggedInvestor', JSON.stringify(user)
      )
      stocksService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setMessage({
        notification: "Wrong credentials",
        status: "error"
      });
      setTimeout(() => {
        setMessage({
          notification: "",
          status: ""
        })
      }, 5000);
    }

  }

  const handleLogout = async () => {
    window.localStorage.clear();

    setUser(null);
  }

  const loginForm = () => {
   
    return (
      <div>
        <Togglable buttonLabel="Login">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      </div>      
    );
  }

  const stockForm = () => (
    <div>
      <div>
        <span>Search stock: </span>
        <input onChange={handleSearch}/>
      </div>
      <Togglable buttonLabel="Add a new stock">
        <AddStockForm createStock={addNewStock}
        />
      </Togglable>
    </div>
  )

  return (
    <div>
      <h2>Investment Portfolio Dashboard</h2>
      <Notification message={message} status={message.status}/>

      { user === null ?
         loginForm() :
         <div>
          <p>Welcome, <strong>{user.name}</strong>. <button onClick={handleLogout}>Logout</button></p>
          { stockForm() }
          <ul>
            {filteredStock.map((s, index) =>
                <li className='stock' key={index}>{s.tickerSymbol}: 
                {s.price} <button onClick={() => removeStock(s.id)} >delete</button>
                </li>
              )
            }
          </ul>
         </div>
      }
      
      <Footer />
    </div>
  );
}

export default App;
