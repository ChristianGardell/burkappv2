import { useState } from 'react'
import './Home.css'


function Home() {
  const [clickedBeer, setClickedBeer] = useState(false);
  const [clickedBuy, setClickedBuy] = useState(false);
  const [clickedShot, setClickedShot] = useState(false);

  function flashOnClick(setter) {
    setter(true);
    setTimeout(() => setter(false), 200);
  }

  return (
    <div className="container">
      <div className="content">
        <h1>Beers: 5</h1>
        
        <div className="button-group">
          <button
            className={clickedBeer ? "beer-button clicked" : "beer-button"}
            onClick={() => flashOnClick(setClickedBeer)}
            >
            -🍺
          </button>
          
          <button className={clickedBuy ? "beer-button clicked" : "beer-button"}
            onClick={() => flashOnClick(setClickedBuy)}
            >
            +🍺
          </button>
          <button
            className={clickedShot ? "beer-button clicked" : "beer-button"}
            onClick={() => flashOnClick(setClickedShot)}
            >
            Buy More
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home