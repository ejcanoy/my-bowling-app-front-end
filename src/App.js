import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'

import { useState } from 'react'

function App() {
  return (
    <>
      <div>
        <ScoreBoard />
      </div>
      <div>
        <CenteredContainer/>
      </div>
    </>
  );
}

function ScoreBoard() {
  return (
    <>
      <Container>
        <div className="tainer">
            <Frame />
            <Frame />
            <Frame />
            <Frame />
            <Frame />
            <Frame />
            <Frame />
            <Frame />
            <Frame />
            <TenthFrame />
        </div>
      </Container>
    </>
  )
}



function Square({ value , onSquareClick }) {

  return (
    <>
    <div class="square">
      <button
        className={value}
        onClick={onSquareClick}
      >
      </button>
    </div>
    </>
  );
}

function Box({ value, isSecondThrow }) {
  let display;
  if (value === 10 && isSecondThrow) {
    display = "/";
  } else if (value === 10) {
    display = "X";
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

function Frame({ throwOne, throwTwo }) {
  return (
    <>
      <div>
        <div className="board-row">
          <Box value={0} />
          <Box value={0} isSecondThrow="True" />
        </div>
        <Rectangle total={0} />
      </div>
    </>
  );
}

function TenthFrame({ value }) {
  return (
    <>
      <div>
        <div className="board-row">
          <Box />
          <Box />
          <Box />
        </div>
        <button className="tenth-rectangle">125</button>
      </div>
    </>
  );
}

// function TenthFrame({ value }) {
//   return (
//     <>
//       <div>
//         <div className="board-row">
//           <Box />
//           <Box />
//           <Box />
//         </div>
//         <button className="tenth-rectangle">125</button>
//       </div>
//     </>
//   );
// }

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
      <Container className="element-with-padding">
        <Row className="justify-content-md-center">
          <Col md="auto">
            <h3>{header}</h3> 
          </Col> 
        </Row>
        <Row className="justify-content-md-center">
          <Col md="auto" xs={3}><Square value={squares[6]} onSquareClick={() => handleClick(6)}/></Col>
          <Col md="auto" xs={3}><Square value={squares[7]} onSquareClick={() => handleClick(7)}/></Col>
          <Col md="auto" xs={3}><Square value={squares[8]} onSquareClick={() => handleClick(8)}/></Col>
          <Col md="auto" xs={3}><Square value={squares[9]} onSquareClick={() => handleClick(9)}/></Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="auto" xs={3}><Square value={squares[3]} onSquareClick={() => handleClick(3)}/></Col>
          <Col md="auto" xs={3}><Square value={squares[4]} onSquareClick={() => handleClick(4)}/></Col>
          <Col md="auto" xs={3}><Square value={squares[5]} onSquareClick={() => handleClick(5)}/></Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="auto" xs={3}><Square value={squares[1]} onSquareClick={() => handleClick(1)}/></Col>
          <Col md="auto" xs={3}><Square value={squares[2]} onSquareClick={() => handleClick(2)}/></Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="auto" xs={3}><Square value={squares[0]} onSquareClick={() => handleClick(0)}/></Col>
        </Row>
      </Container>
      <Row className="justify-content-md-center">
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


export default App;
