// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({squares, onSquareSelected}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onSquareSelected(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [moves, setMoves] = useLocalStorageState('tic-tac-toe:history', [Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useLocalStorageState('tic-tac-toe:step', 0)

  const squares = moves[currentMove]
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={squares} onSquareSelected={handleOnSquareSelected} />
        <button
          className="restart"
          onClick={() => {
            setMoves([Array(9).fill(null)])
            setCurrentMove(0)
          }}
        >
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <Moves moves={moves} currentMove={currentMove} onCurrentMoveChanged={setCurrentMove}/>
      </div>
    </div>
  )

  function handleOnSquareSelected(square) {
    if (squares[square] || winner) {
      return
    }
    const movesCopy = moves.slice(0, currentMove + 1)
    const squaresCopy = [...squares]
    squaresCopy[square] = nextValue
    movesCopy.push(squaresCopy)
    setMoves(movesCopy)
    setCurrentMove(movesCopy.length - 1)
  }
}

function Moves({moves, currentMove, onCurrentMoveChanged}) {
  return (
    <ol>
      {moves.map((move, index) => {
        const message = index === 0 ? `Go to game start` : `Go to move #${index}`
        return (
          <li key={`move #${index}`}>
            { currentMove === index ?
              <button disabled>{`${message} (current)`}</button>
              :
              <button onClick={() => onCurrentMoveChanged(index)}>{message}</button>
            }
          </li>
        )
      })}
    </ol>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
