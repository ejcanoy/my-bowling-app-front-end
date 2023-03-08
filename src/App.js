import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import React from 'react';

import { useState, useEffect } from 'react'

const blank_frame = {
  game_id: 0,
  frame_number: 1,
  bonus: 0,
  throw_one: -1,
  throw_two: -1,
}


function App() {
  return (
    <>
      <div>
        <ScoreBoard />
      </div>
      <div>

      </div>
      <div>
        <CenteredContainer/>
      </div>
    </>
  );
}

function ScoreBoard() {
  const [data, setData] = useState(Array(10).fill({}));
  const [game, setGame] = useState({});
  const [score, setScore] = useState(Array(10).fill(-1));
  const [inputValue, setInputValue] = useState("");
  const [pinsLeft, setPinsLeft] = useState(10);
  const curFrame = {...data[game.frame - 1]}
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);


  // useEffect(() => {
  //   axios.get('http://localhost:8000/game/0')
  //     .then(response => {
  //       // console.log(response.data.Responses);
  //       const arr = response.data.Responses.Frame_Information.slice();
  //       arr.sort((a, b) => a.frame_number - b.frame_number);
  //       // console.log(arr);
  //       const g = response.data.Responses.Game_Information[0];
  //       setGame(g);
  //       setData(arr);
  //       if (arr[g.frame - 1].throw_one !== -1) {
  //         setPinsLeft(pinsLeft - arr[g.frame - 1].throw_one);
  //       }
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // }, [data]);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       setLoading(true);
  //       const response = await axios.get('http://localhost:8000/game/0');
  //       console.log(response.data.Responses.Frame_Information.slice());
  //       const arr = response.data.Responses.Frame_Information.slice()
  //       arr.sort((a, b) => a.frame_number - b.frame_number);
  //       const g = response.data.Responses.Game_Information[0];
  //       setGame(g);
  //       setData(arr);
  //       if (arr[g.frame - 1].throw_one !== -1) {
  //         setPinsLeft(pinsLeft - arr[g.frame - 1].throw_one);
  //       }
  //     } catch(error) {
  //       console.error(error);
  //       setErrorMessage("Error fetching data");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  
  //   fetchData();
  // }, [data]);

  useEffect(() => {
    setLoading(true); // Set loading to true before making the API call
    axios.get('http://localhost:8000/game/0')
      .then(response => {
        const arr = response.data.Responses.Frame_Information.slice();
        arr.sort((a, b) => a.frame_number - b.frame_number);
        const g = response.data.Responses.Game_Information[0];
        setGame(g);
        setData(arr);
        if (arr[g.frame - 1].throw_one !== -1 && ((g.frame !== 10) || (g.frame === 10 && arr[g.frame - 1].throw_one + arr[g.frame - 1].throwTwo < 10))) {
          setPinsLeft(pinsLeft - arr[g.frame - 1].throw_one);
        } else if (g.frame === 10 && arr[g.frame - 1].throw_one === 10 && arr[g.frame - 1].throw_two !== -1 && arr[g.frame - 1].throw_two < 10) {
          setPinsLeft(pinsLeft - arr[g.frame - 1].throw_two);
        } else if (isGameOver()) {
          setPinsLeft(null);
          setErrorMessage("Game Over");
        } else {
          setPinsLeft(10);
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => setLoading(false)); // Set loading to false once the API call is complete
  }, []);
  

  function isGameOver(g) {
    return g['is_game_over'];
  }

  const handleSubmit = async () => {
    if (isGameOver()) {
      setErrorMessage("Game Is Over");
      return;
    }
    const newGame = {...game};
    const newData = {...data};
    
    let throwName = "";

      // deals with adding value to specific throw in frame
      if (game.throw === 1) {
        throwName = "throw_one";
      } else if (game.throw === 2) {
        throwName = "throw_two";
      } else {
        throwName = "throw_three"
      }
    newData[game.frame - 1][throwName] = parseInt(inputValue);

    // create object that sends game and 
    const body = {newGame, newData}

    putData(body).then(() => getData());
  }

  const putData = async (body) => {
    try {
      const response = await axios.put('http://localhost:8000/frames/0', {body});
    } catch(error) {
      console.error(error)
    }

  }
  
  const getData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/game/0');
      const arr = response.data.Responses.Frame_Information.slice();
      arr.sort((a, b) => a.frame_number - b.frame_number);
      const g = response.data.Responses.Game_Information[0];
      setGame(g);
      setData(arr);
      if (arr[g.frame - 1].throw_one !== -1 && ((g.frame !== 10) || (g.frame === 10 && arr[g.frame - 1].throw_one + arr[g.frame - 1].throwTwo < 10))) {
        setPinsLeft(pinsLeft - arr[g.frame - 1].throw_one);
      } else if (g.frame === 10 && arr[g.frame - 1].throw_one === 10 && arr[g.frame - 1].throw_two !== -1 && arr[g.frame - 1].throw_two < 10) {
        setPinsLeft(pinsLeft - arr[g.frame - 1].throw_two);
      } else if (isGameOver(g)) {
        setErrorMessage("Game Over");
      } else {
        setPinsLeft(10);
      }
    } catch(error) {
      console.error(error);
    }
  }

  const handleInputChange = (event) => {
    if (isGameOver()) {
      setErrorMessage(`Game Over`);
      return;
    }
    const newValue = event.target.value;
    if (newValue < 0 || newValue > pinsLeft) {
      setErrorMessage(`Value must be between 0 and ${pinsLeft}`);
    } else {
      setInputValue(newValue);
      setErrorMessage("");
    }
  };

  const frameTotal = (frame) => {
    let total = 0;
    for (let i = 0; i <= frame; i++) {
      if (data[i].throw_one !== -1) {
        total += data[i].throw_one;
      }
      if (data[i].throw_two !== -1) {
        total += data[i].throw_two;
      }
      total += data[i].bonus_pins;
    }
    if (frame === 9 && data[9].throw_three !== -1) {
      total += data[9].throw_three;
    }
    return total;
  }
  return (
    <>
      <div>
        <h3> Frame {game.frame} </h3>
        <h3> Throw {game.throw} </h3>
      </div>
      <div className="tainer">
        <Frame f={1} throwOne={data[0].throw_one} throwTwo={data[0].throw_two} total={game.frame >= 1 && data[0].throw_one !== -1 ? frameTotal(0) : null}/>
        <Frame f={2} throwOne={data[1].throw_one} throwTwo={data[1].throw_two} total={game.frame >= 2 && data[1].throw_one !== -1 ? frameTotal(1) : null} />
        <Frame f={3} throwOne={data[2].throw_one} throwTwo={data[2].throw_two} total={game.frame >= 3 && data[2].throw_one !== -1 ? frameTotal(2) : null} />
        <Frame f={4} throwOne={data[3].throw_one} throwTwo={data[3].throw_two} total={game.frame >= 4 && data[3].throw_one !== -1 ? frameTotal(3) : null} />
        <Frame f={5} throwOne={data[4].throw_one} throwTwo={data[4].throw_two} total={game.frame >= 5 && data[4].throw_one !== -1 ? frameTotal(4) : null} />
        <Frame f={6} throwOne={data[5].throw_one} throwTwo={data[5].throw_two} total={game.frame >= 6 && data[5].throw_one !== -1 ? frameTotal(5) : null} />
        <Frame f={7} throwOne={data[6].throw_one} throwTwo={data[6].throw_two} total={game.frame >= 7 && data[6].throw_one !== -1 ? frameTotal(6) : null} />
        <Frame f={8} throwOne={data[7].throw_one} throwTwo={data[7].throw_two} total={game.frame >= 8 && data[7].throw_one !== -1 ? frameTotal(7) : null} />
        <Frame f={9} throwOne={data[8].throw_one} throwTwo={data[8].throw_two} total={game.frame >= 9 && data[8].throw_one !== -1 ? frameTotal(8) : null} />
        <TenthFrame throwOne={data[9].throw_one} throwTwo={data[9].throw_two} throwThree={data[9].throw_three} total={game.frame >= 10 && data[9].throw_one !== -1  ? frameTotal(9) : null} />
      </div>
      <div classname="container">
        <div>
          <h4>{errorMessage === "Game Over" ? null : `${pinsLeft} pins left`}</h4>
          {errorMessage && (
          <div style={{ color: "red" }}>{errorMessage}</div>
          )}
          <input type="number" min="0" max="10" value={inputValue} onChange={handleInputChange} />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </>
  )

}

// pin shape
function Square({ value, number, onSquareClick }) {
  if (value === "knocked-dot") {
    number = null;
  }

  return (
    <>
      <div class="square">
        <button
          className={value}
          onClick={onSquareClick}
        >{number}
        </button>
      </div>
    </>
  );
}

function Box({ value, isSecondThrow }) {
  let display;
  if (value === 10 && isSecondThrow === "True") {
    display = "/";
  } else if (value === 10) {
    display = "X";
  } else if (value === -1) {
    display = null;
  } else if (value === 0) {
    display = "-"
  } else {
    display = value;
  }
  return (
    <>
      <button className="box">{display}</button>
    </>
  );
}

function Rectangle({ total }) {
  return (
    <>
      <button className="rectangle">{total}</button>
    </>
  );
}

function Frame({f, throwOne, throwTwo, total}) {
  return (
    <>
      <div>
        <div className="board-row">
          <Box value={throwOne} />
          <Box value={throwOne + throwTwo === 10 ? 10 : throwTwo} isSecondThrow="True" />
        </div>
        <Rectangle total={total} />
      </div>
    </>
  );
}

function TenthFrame({ throwOne, throwTwo, throwThree, total}) {
  return (
    <>
      <div>
        <div className="board-row">
          <Box value={throwOne}/>
          <Box value={(throwOne !== 10 && throwOne + throwTwo === 10)? 10 : throwTwo} isSecondThrow={(throwOne !== 10 && throwOne + throwTwo === 10) ? "True" : "False"}/>
          <Box value={(throwTwo !== 10 && throwTwo + throwThree === 10)? 10 : throwThree} isSecondThrow={(throwOne + throwTwo === 10 )? "False" : "True"}/>
        </div>
        <button className="tenth-rectangle">{total}</button>
      </div>
    </>
  );
}

function CenteredContainer() {
  const [squares, setSquares] = useState(Array(10).fill("dot"));
  let header = "knock some pins down";

  function handleSubmit() {
    let count = 0;
    for (let i = 0; i < 10; i++) {
      if (squares[i] === "knocked-dot") {
        count++;
      }
    }

    // try post
    // else retry
    console.log(count + " pins knocked! " + squares)
  }

  function handleClick(i) {
    const nextSquares = squares.slice();

    // if throw is 2 and squares[i] = knocked
    if (nextSquares[i] === "dot") {
      nextSquares[i] = "knocked-dot";
    } else {
      nextSquares[i] = "dot";
    }
    setSquares(nextSquares);
  }

  return (
    <Container>
      <Container className="">
        <Row className="justify-content-md-center">
          <Col md="auto">
            <h3>{header}</h3>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="auto" xs={3}><Square value={squares[6]} number={7} onSquareClick={() => handleClick(6)} /></Col>
          <Col md="auto" xs={3}><Square value={squares[7]} number={8} onSquareClick={() => handleClick(7)} /></Col>
          <Col md="auto" xs={3}><Square value={squares[8]} number={9} onSquareClick={() => handleClick(8)} /></Col>
          <Col md="auto" xs={3}><Square value={squares[9]} number={10} onSquareClick={() => handleClick(9)} /></Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="auto" xs={3}><Square value={squares[3]} number={4} onSquareClick={() => handleClick(3)} /></Col>
          <Col md="auto" xs={3}><Square value={squares[4]} number={5} onSquareClick={() => handleClick(4)} /></Col>
          <Col md="auto" xs={3}><Square value={squares[5]} number={6} onSquareClick={() => handleClick(5)} /></Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="auto" xs={3}><Square value={squares[1]} number={2} onSquareClick={() => handleClick(1)} /></Col>
          <Col md="auto" xs={3}><Square value={squares[2]} number={3} onSquareClick={() => handleClick(2)} /></Col>
        </Row>
        <Row className="justify-content-center">
          {/* <Col md="auto" xs={3}><Square value={squares[0]} onSquareClick={() => handleClick(0)}/></Col> */}
          <Col md="auto" xs={3}><Square value={squares[0]} number={1} onSquareClick={() => handleClick(0)} /></Col>

        </Row>
      </Container>
      <Row className="justify-content-center">
        <Col md="auto" xs={3}>
          <Button variant="dark" onClick={() => handleSubmit()}>10</Button>
        </Col>
        <Col md="auto" xs={3}>
          <Button variant="dark" onClick={() => handleSubmit()}>Next</Button>
        </Col>
      </Row>
    </Container>
  );
}

function Pins() {
  return (
    <>
      <Container className="d-flex align-items-center justify-content-center">
        <Row>
          <Col>
            <Pin />
          </Col>
          <Col>
            <Pin />
            <Pin />
          </Col>
          <Col>
            <Pin />
            <Pin />
            <Pin />
          </Col>
          <Col>
            <Pin />
            <Pin />
            <Pin />
            <Pin />
          </Col>
        </Row>
      </Container>
    </>
  );
}

function Pin() {
  return (
    <button className="dot"></button>
  );
}



const game = {
  "Items": [
    {
      "throw_two": -1,
      "bonus": 0,
      "throw_one": -1,
      "frame_number": 1,
      "game_id": 0
    },
    {
      "throw_two": -1,
      "bonus": 0,
      "throw_one": -1,
      "frame_number": 2,
      "game_id": 0
    },
    {
      "throw_two": -1,
      "bonus": 0,
      "throw_one": -1,
      "frame_number": 3,
      "game_id": 0
    },
    {
      "throw_two": -1,
      "bonus": 0,
      "throw_one": -1,
      "frame_number": 4,
      "game_id": 0
    },
    {
      "throw_two": -1,
      "bonus": 0,
      "throw_one": -1,
      "frame_number": 5,
      "game_id": 0
    },
    {
      "throw_two": -1,
      "bonus": 0,
      "throw_one": -1,
      "frame_number": 6,
      "game_id": 0
    },
    {
      "throw_two": -1,
      "bonus": 0,
      "throw_one": -1,
      "frame_number": 7,
      "game_id": 0
    },
    {
      "throw_two": -1,
      "bonus": 0,
      "throw_one": -1,
      "frame_number": 8,
      "game_id": 0
    },
    {
      "throw_two": -1,
      "bonus": 0,
      "throw_one": -1,
      "frame_number": 9,
      "game_id": 0
    },
    {
      "throw_two": -1,
      "bonus": 0,
      "throw_one": -1,
      "frame_number": 10,
      "game_id": 0
    }
  ],
  "Count": 10,
  "ScannedCount": 10
};

export default App;
