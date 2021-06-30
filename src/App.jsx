import React from 'react';
import "./App.css";

function Square(props) {
    return <button className={props.color + " square"} onClick={props.onClick}></button>;
}

function intToColor(x) {
    if (x === 0) return "white";
    if (x === 1) return "red";
    if (x === 2) return "blue";
    return null;
}

function createEmptyBoard(rows, columns) {
    return Array(rows).fill(0).map(i => Array(columns).fill(0));
}

function flipBoolean(bool) {
    if (bool === true) return false;
    if (bool === false) return true;
    return null;
}

const dx = [-1, -1, -1, 0, 0, 1, 1, 1];
const dy = [-1, 0, 1, -1, 1, -1, 0, 1];

function getWinner(board, rows, columns) {
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) if (board[row][column]) {
            for (let direction = 0; direction < dx.length; direction++) {
                let required = 4, currentRow = row, currentColumn = column;
                while (required > 0) {
                    if (currentRow < 0 || currentRow >= rows || currentColumn < 0 || currentColumn >= columns) break;
                    if (board[currentRow][currentColumn] !== board[row][column]) break;
                    currentRow += dx[direction];
                    currentColumn += dy[direction];
                    required--;
                }
                if (required === 0) {
                    console.log("we return " + board[row][column]);
                    return board[row][column];
                }
            }
        }
    }
    return 0;
}

class Board extends React.Component {
    renderSquare(row, column) {
        return <Square color={intToColor(this.props.board[row][column])} onClick={() => this.props.handleClick(column)} />
    }
    render() {
        const rows = this.props.rows;
        const columns = this.props.columns;
        let board = [];
        for (let i = 0; i < rows; i++) {
            let board_row = [];
            for (let j = 0; j < columns; j++) board_row.push(this.renderSquare(i, j));
            board.push(<div className="board-row">{board_row}</div>);
        }
        return <div className="board">{board}</div>;
    }
}


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{board: createEmptyBoard(this.props.rows, this.props.columns)}],
            turn1: true,
            winner: 0,
        }
    }
    handleClick(column) {
        if (this.state.winner) return;
        const history = this.state.history;
        const board = history[history.length - 1].board.map((row) => (row.slice()));
        for (let row = this.props.rows - 1; row >= 0; row--) {
            if (board[row][column] > 0) continue;
            board[row][column] = this.state.turn1 ? 1 : 2;
            this.setState({
                history: history.concat([{board: board}]),
                turn1: flipBoolean(this.state.turn1),
            });
            return;
        }
    }
    undo() {
        let history = this.state.history;
        if (history.length === 1) return;
        history.pop();
        this.setState({
            history: history,
            winner: 0,
            turn1: flipBoolean(this.state.turn1),
        });
    }
    render() {
        const history = this.state.history;

        let turnColor = (this.state.turn1 ? "red" : "blue");
        let status = <div className={"turntext" + turnColor}>Current turn: {turnColor}</div>;
        let winner = this.state.winner;
        if (!winner) {
            winner = getWinner(history[history.length - 1].board, this.props.rows, this.props.columns);
            if (winner) {
                this.setState({
                    winner: winner,
                });
            }
        }
        if (winner) status = <div className={"turntext" + intToColor(winner)}>Winner: {intToColor(winner)}</div>;

        let undoButton = <button className={"undobutton"} onClick={() => this.undo()}>Undo</button>;

        return <div>
            <Board rows={this.props.rows} columns={this.props.columns} 
                board={history[history.length - 1].board} handleClick={(column) => this.handleClick(column)} />
            {status}
            {undoButton}
        </div>;
    }
}

export default App;