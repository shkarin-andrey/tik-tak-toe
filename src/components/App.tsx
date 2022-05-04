import { useEffect, useState } from "react";

const App = () => {
  const grid = Array(9).fill(null);
  const [gridGame, setGridGame] = useState(grid);
  const [computerTurn, setPersonTurn] = useState(false);
  const messageState = {
    showMessage: false,
    text: "",
    status: "tie",
  };
  const [message, setMessage] = useState(messageState);

  const PARAMS = {
    circle: "♺",
    cross: "✘",
  };

  const win = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const reset = () => {
    setGridGame(grid);
    setPersonTurn(false);
  };

  const isWin = () => {
    win.map((x:number[]) => {
      const testGridGame = JSON.stringify([
        gridGame[x[0]],
        gridGame[x[1]],
        gridGame[x[2]],
      ]);
      const testResultCircle = JSON.stringify([
        PARAMS.circle,
        PARAMS.circle,
        PARAMS.circle,
      ]);
      const testResultCross = JSON.stringify([
        PARAMS.cross,
        PARAMS.cross,
        PARAMS.cross,
      ]);

      if (testGridGame === testResultCircle) {
        setMessage({
          status: "gameOver",
          showMessage: true,
          text: "Упс... Проиграли кажется!",
        });
        reset();
      }
      if (testGridGame === testResultCross) {
        setMessage({
          status: "win",
          showMessage: true,
          text: "Поздравляю, вы победили!",
        });
        reset();
      }
    });
  };

  const updatePersonItem = (index: number) => {
    if (gridGame[index] !== PARAMS.circle && gridGame[index] !== PARAMS.cross) {
      gridGame.splice(index, 1, PARAMS.cross);
      setGridGame([...gridGame]);
      setPersonTurn(true);
      isWin();
    }
  };

  const updateComputerItem = () => {
    const random = Math.ceil(Math.random() * (grid.length - 1 - 0) + 0);
    if (
      gridGame[random] === PARAMS.circle ||
      gridGame[random] === PARAMS.cross
    ) {
      updateComputerItem();
    } else {
      gridGame.splice(random, 1, PARAMS.circle);
      setGridGame([...gridGame]);
      setPersonTurn(false);
      isWin();
    }
  };

  useEffect(() => {
    const idx = gridGame.indexOf(null);

    if (idx === -1) {
      setMessage({
        status: "tie",
        showMessage: true,
        text: "Ничья. Сыграйте еще раз!",
      });
      reset();
    }

    if (computerTurn && idx !== -1) {
      updateComputerItem();
    }
  }, [computerTurn]);

  const status = () => {
    switch (message.status) {
      case "tie":
        return "message__orange";
      case "win":
        return "message__green";
      case "gameOver":
        return "message__red";
      default:
        return "message__orange";
    }
  };

  useEffect(() => {
    if (message.showMessage) {
      status();
    }
  }, [message.showMessage]);

  return (
    <div className="App">
      <h1>Крестики нолики!</h1>
      <div className="grid">
        {gridGame.map((item: string | null, index: number) => (
          <div
            key={"grid-item-" + index}
            className={`grid-item ${item === PARAMS.cross ? "green" : "red"}`}
            onClick={() => updatePersonItem(index)}
          >
            {item}
          </div>
        ))}
      </div>
      <button className="btn" onClick={reset}>
        Сбросить
      </button>
      <div
        className={`message ${
          message.showMessage ? status() + " fadeIn" : "fadeOut"
        }`}
      >
        <div
          className="close"
          onClick={() =>
            setMessage({
              ...message,
              showMessage: false,
            })
          }
        >
          ✘
        </div>
        {message.text}
      </div>
    </div>
  );
};

export default App;
