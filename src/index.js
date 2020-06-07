import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {ButtonToolbar, Dropdown, DropdownButton} from "react-bootstrap";



class Box extends React.Component {

    selectBox = () => {
        this.props.selectBox(this.props.row, this.props.col);
    }

    render() {
        return(
            <div
                className={this.props.boxClass}
                id={this.props.id}
                onClick={this.selectBox}
            />
        );
    }
}

class Grid extends React.Component {
    render() {
        const width = (this.props.cols * 16);
        var rowsArr = [];

        var boxClass = "";
        for (var i = 0; i < this.props.rows; i++) {
            for (var j = 0; j < this.props.cols; j++) {
                let boxId = i + "_" + j;

                boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
                rowsArr.push(
                    <Box
                    boxClass={boxClass}
                    key={boxId}
                    boxId={boxId}
                    row={i}
                    col={j}
                    selectBox={this.props.selectBox}
                    />
                );
            }
        }

        return(
            <div className="grid" style={{width: width}}>
                {rowsArr}
            </div>
        );
    }
}

class Buttons extends React.Component {

    handleSelect = (evt) => {
        this.props.gridSize(evt);
    }

    render() {
        return(
            <div className="center">
                <ButtonToolbar>
                    <button className="btn btn-default" onClick={this.props.playButton}>
                        Play
                    </button>
                    <button className="btn btn-default" onClick={this.props.pauseButton}>
                        Pause
                    </button>
                    <button className="btn btn-default" onClick={this.props.clear}>
                        Clear
                    </button>
                    <button className="btn btn-default" onClick={this.props.slow}>
                        Slow
                    </button>
                    <button className="btn btn-default" onClick={this.props.fast}>
                        Fast
                    </button>
                    <button className="btn btn-default" onClick={this.props.seed}>
                        Seed
                    </button>
                    {
                    <DropdownButton id="Grid Size" title="size-menu" onSelect={this.handleSelect}>
                        <Dropdown.Item eventKey="1">20x10</Dropdown.Item>
                        <Dropdown.Item eventKey="2">50x30</Dropdown.Item>
                        <Dropdown.Item eventKey="1">70x50</Dropdown.Item>
                    </DropdownButton>
                    }
                </ButtonToolbar>
            </div>
        )
    }
}

class Main extends React.Component{
    constructor() {
        super();

        this.speed = 100;
        this.rows = 30;
        this.cols = 50;

        this.state = {
            generation: 0,
            gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
        }
    }

    //helper function
    //finner den eksakte boksen som har blitt klikket og setter det til det motsatte
    selectBox = (row, col) => {
        let gridCopy = arrayClone(this.state.gridFull);
        gridCopy[row][col] = !gridCopy[row][col];
        this.setState({
            gridFull: gridCopy
        })
    }

    seed = () => {
        let gridCopy = arrayClone(this.state.gridFull);
        for (let x = 0; x < this.rows; x++) {
            for (let y = 0; y < this.cols; y++) {
                if (Math.floor(Math.random() * 4) === 1){
                    gridCopy[x][y] = true;
                }
            }
        }
        this.setState({
            gridFull: gridCopy
        })
    }

    playButton = () => {
        clearInterval(this.intervalId)
        this.intervalId = setInterval(this.play, this.speed)
    }

    pauseButton = () => {
        clearInterval(this.intervalId)
    }

    play = () => {
        let g = this.state.gridFull;
        let g2 = arrayClone(this.state.gridFull);

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let count = 0;
                if (i > 0) if (g[i - 1][j]) count++;
                if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
                if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
                if (j < this.cols - 1) if (g[i][j + 1]) count++;
                if (j > 0) if (g[i][j - 1]) count++;
                if (i < this.rows - 1) if (g[i + 1][j]) count++;
                if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
                if (i < this.rows - 1 && j < this.cols - 1) if (g[i + 1][j + 1]) count++;
                if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
                if (!g[i][j] && count === 3) g2[i][j] = true;
            }
        }
        this.setState({
            gridFull: g2,
            generation: this.state.generation++
        })
    }

    componentDidMount() {
        this.seed();
        this.playButton();
    }

    render() {
        return(
            <div>
                <h1>The Game of Life</h1>
                <Buttons
                    playButton={this.pauseButton()}
                    pauseButton={this.pauseButton()}
                    slow={this.slow}
                    fast={this.fast}
                    clear={this.clear}
                    seed={this.seed}
                    gridSize={this.gridSize}
                    />
                <Grid
                    //will be used as props in grid component
                    gridFull={this.state.gridFull}
                    rows={this.rows}
                    cols={this.cols}
                    selectBox={this.selectBox}
                />
                <h2>Generations: {this.state.generation}</h2>
            </div>
        )
    }
}

function arrayClone(arr){
    //deep clone fordi arr er en nested array. Hvis den ikke hadde vært det kunne vi bare brukt array.slice
    //må klone alle array inni array
    return JSON.parse(JSON.stringify(arr));
}

ReactDOM.render(
    <Main/>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
