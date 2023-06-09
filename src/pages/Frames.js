import axios from "axios";
import React from "react";
import { useLoaderData, useParams } from 'react-router-dom';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react'

const Frames = () => {
    const { id } = useParams(); 
    // console.log(id);
    return (
        <>
            
            <Game id={id}/>
        </>
    );
}

function Game({id}) {
    const [data, setData] = useState(Array(10).fill({}));
    const [game, setGame] = useState({});
    const [inputValue, setInputValue] = useState(0);
    const [pinsLeft, setPinsLeft] = useState(10);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [radioValue, setRadioValue] = useState('1');
    const [squares, setSquares] = useState([]);
  
    console.log(id);
    useEffect(() => {
      setLoading(true); // Set loading to true before making the API call
      axios.get('http://localhost:8000/games/' + id)
        .then(response => {
          const arr = response.data.Responses.Frame_Information.slice();
          console.log(arr);
          arr.sort((a, b) => a.frame_number - b.frame_number);
          const g = response.data.Responses.Game_Information[0];
          setGame(g);
          setData(arr);
          if (arr[g.frame - 1].throw_one !== -1 && ((g.frame !== 10) || (g.frame === 10 && arr[g.frame - 1].throw_one + arr[g.frame - 1].throwTwo < 10))) {
            setPinsLeft(pinsLeft - arr[g.frame - 1].throw_one);
            setSquares(arr[g.frame - 1].pins_up_one)
          } else if (g.frame === 10 && arr[g.frame - 1].throw_one === 10 && arr[g.frame - 1].throw_two !== -1 && arr[g.frame - 1].throw_two < 10) {
            setPinsLeft(pinsLeft - arr[g.frame - 1].throw_two);
            setSquares(arr[g.frame - 1].pins_up_two)
          } else if (isGameOver()) {
            setSquares(["knocked-dot", "knocked-dot", "knocked-dot", "knocked-dot", "knocked-dot", "knocked-dot", "knocked-dot", "knocked-dot", "knocked-dot", "knocked-dot"]);
            setPinsLeft(null);
            setErrorMessage("Game Over");
          } else {
            setPinsLeft(10);
            if (g.frame === 10 && g.throw === 3) {
              setSquares(arr[g.frame - 1].pins_up_three);
            } else {
              setSquares(arr[g.frame - 1].pins_up_one)
            }
          }
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => setLoading(false)); // Set loading to false once the API call is complete
    }, []);
  
    function isGameOver(g) {
      if (g === null) return;
      return game['is_game_over'];
    }
  
    const handleClear = async () => {
      clearGame().then(() => getData());
    }
  
    const putData = async (body) => {
      try {
        const response = await axios.put('http://localhost:8000/frames/' + id, { body });
      } catch (error) {
        console.error(error)
      }
    
    }
  
    const clearGame = async () => {
      try {
        const response = await axios.post('http://localhost:8000/games/' + id);
      } catch (error) {
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
  
    const handleSubmit = async (c) => {
      if (isGameOver()) {
        setErrorMessage("Game Is Over");
        return;
      }
      const newGame = { ...game };
      const newData = { ...data };
  
      let throwName = "";
      let pinsName = "";
  
      // deals with adding value to specific throw in frame
      if (game.throw === 1) {
        throwName = "throw_one";
        pinsName = "pins_up_one";
      } else if (game.throw === 2) {
        throwName = "throw_two";
        pinsName = "pins_up_one";
      } else {
        throwName = "throw_three"
      }
  
      if (c !== null && c === 10) {
        newData[game.frame - 1][throwName] = 10;
        newData[game.frame - 1][pinsName] = ["knocked-dot", "knocked-dot", "knocked-dot", "knocked-dot", "knocked-dot", "knocked-dot", "knocked-dot", "knocked-dot", "knocked-dot", "knocked-dot"];
      } else {
        newData[game.frame - 1][throwName] = parseInt(inputValue);
        newData[game.frame - 1][pinsName] = squares;
      }
      // create object that sends game and 
      const body = { newGame, newData }
      putData(body).then(() => getData());
    }
  
    const getData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/games/' + id);
        const arr = response.data.Responses.Frame_Information.slice();
        arr.sort((a, b) => a.frame_number - b.frame_number);
        const g = response.data.Responses.Game_Information[0];
        setGame(g);
        setData(arr);
        setInputValue(0);
        if (arr[g.frame - 1].throw_one !== -1 && ((g.frame !== 10) || (g.frame === 10 && arr[g.frame - 1].throw_one + arr[g.frame - 1].throwTwo < 10))) {
          setPinsLeft(pinsLeft - arr[g.frame - 1].throw_one);
          setSquares(arr[g.frame - 1].pins_up_one)
        } else if (g.frame === 10 && arr[g.frame - 1].throw_one === 10 && arr[g.frame - 1].throw_two !== -1 && arr[g.frame - 1].throw_two < 10) {
          setPinsLeft(pinsLeft - arr[g.frame - 1].throw_two);
          setSquares(arr[g.frame - 1].pins_up_two)
        } else if (isGameOver(g)) {
          setErrorMessage("Game Over");
        } else {
          setPinsLeft(10);
          if (g.frame === 10 && g.throw === 3) {
            setSquares(arr[g.frame - 1].pins_up_three);
          } else {
            setSquares(arr[g.frame - 1].pins_up_two)
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    return (
      <>
        <Row className="justify-content-center">
          <Button onClick={() => handleClear()} >Clear Game</Button>
          <ScoreBoard data={data} game={game} />
          <br />
  
          {isGameOver() ?
            <Row className="justify-content-md-center">
              <Col md="auto">
                <br />
                <br />
                <h4 style={{ color: 'red' }}>Game Over</h4>
              </Col>
            </Row> :
            <Rack data={data} game={game} handleSubmit={handleSubmit} setInputValue={setInputValue} squares={squares} setSquares={setSquares} pinsLeft={pinsLeft} />}
        </Row>
      </>
    )
  
  }
  
  function ScoreBoard({ data, game }) {
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
          <Frame throwOne={data[0].throw_one} throwTwo={data[0].throw_two} total={game.frame >= 1 && data[0].throw_one !== -1 ? frameTotal(0) : null} />
          <Frame throwOne={data[1].throw_one} throwTwo={data[1].throw_two} total={game.frame >= 2 && data[1].throw_one !== -1 ? frameTotal(1) : null} />
          <Frame throwOne={data[2].throw_one} throwTwo={data[2].throw_two} total={game.frame >= 3 && data[2].throw_one !== -1 ? frameTotal(2) : null} />
          <Frame throwOne={data[3].throw_one} throwTwo={data[3].throw_two} total={game.frame >= 4 && data[3].throw_one !== -1 ? frameTotal(3) : null} />
          <Frame throwOne={data[4].throw_one} throwTwo={data[4].throw_two} total={game.frame >= 5 && data[4].throw_one !== -1 ? frameTotal(4) : null} />
          <Frame throwOne={data[5].throw_one} throwTwo={data[5].throw_two} total={game.frame >= 6 && data[5].throw_one !== -1 ? frameTotal(5) : null} />
          <Frame throwOne={data[6].throw_one} throwTwo={data[6].throw_two} total={game.frame >= 7 && data[6].throw_one !== -1 ? frameTotal(6) : null} />
          <Frame throwOne={data[7].throw_one} throwTwo={data[7].throw_two} total={game.frame >= 8 && data[7].throw_one !== -1 ? frameTotal(7) : null} />
          <Frame throwOne={data[8].throw_one} throwTwo={data[8].throw_two} total={game.frame >= 9 && data[8].throw_one !== -1 ? frameTotal(8) : null} />
          <TenthFrame throwOne={data[9].throw_one} throwTwo={data[9].throw_two} throwThree={data[9].throw_three} total={game.frame >= 10 && data[9].throw_one !== -1 ? frameTotal(9) : null} />
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
        <div className="square">
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
  
  function Frame({ f, throwOne, throwTwo, total }) {
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
  
  function TenthFrame({ throwOne, throwTwo, throwThree, total }) {
    return (
      <>
        <div>
          <div className="board-row">
            <Box value={throwOne} />
            <Box value={(throwOne !== 10 && throwOne + throwTwo === 10) ? 10 : throwTwo} isSecondThrow={(throwOne !== 10 && throwOne + throwTwo === 10) ? "True" : "False"} />
            <Box value={(throwTwo !== 10 && throwTwo + throwThree === 10) ? 10 : throwThree} isSecondThrow={(throwOne + throwTwo >= 10) ? "False" : "True"} />
          </div>
          <button className="tenth-rectangle">{total}</button>
        </div>
      </>
    );
  }
  
  function Rack({ data, game, handleSubmit, inputValue, setInputValue, squares, setSquares, pinsLeft }) {
    let header = "knock some pins down";
  
    function calculatePins(nextSquares) {
      let count = 0;
      for (let i = 0; i < 10; i++) {
        if (nextSquares[i] === "knocked-dot") {
          count++;
        }
      }
      return count - (10 - pinsLeft);
    }
  
    function handleClick(i) {
      // how do we deal with 10th frame?
  
      let nextSquares = [...squares];
      if (game.throw === 2 && data[game.frame - 1].pins_up_one[i] === "knocked-dot") {
        return;
      }
  
      if (nextSquares[i] === "dot") {
        nextSquares[i] = "knocked-dot";
      } else {
        nextSquares[i] = "dot";
      }
  
      setInputValue(calculatePins(nextSquares));
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
          <Col md="auto" xs={4}>
            <Button variant="dark" onClick={() => handleSubmit(10)}>{pinsLeft}</Button>
          </Col>
          <Col md="auto" xs={4}>
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


export default Frames;