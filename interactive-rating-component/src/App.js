import { useState } from 'react';
import Rating from './components/Rating';
import ThankYou from './components/ThankYou';
import './css/styles.css';

function App() {
  const [choice, setChoice] = useState('');
  const [page, setPage] = useState('rating');

  if (page === 'thankyou') {
    return (
      <div className="App">
        <ThankYou show={page === 'thankyou'} choice={choice}/>
      </div>
    );
  }

  return (
    <div className="App">
      <Rating show={page === 'rating'} setPage={setPage} setChoice={setChoice} choice={choice}/>
    </div>
  );
}

export default App;
