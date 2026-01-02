const { spawn } = require("child_process");

exports.evaluateFen = function (fen, depth = 12) {
  return new Promise((resolve) => {
    const sf = spawn("stockfish");

    let bestMove = null;
    let evalCp = null;
    let mate = null;

    sf.stdin.write("uci\n");
    sf.stdin.write("isready\n");
    sf.stdin.write(`position fen ${fen}\n`);
    sf.stdin.write(`go depth ${depth}\n`);

    sf.stdout.on("data", (data) => {
      const lines = data.toString().split("\n");

      for (const line of lines) {
        if (line.includes("score cp")) {
          evalCp = parseInt(line.split("score cp")[1]);
        }
        if (line.includes("score mate")) {
          mate = parseInt(line.split("score mate")[1]);
        }
        if (line.startsWith("bestmove")) {
          bestMove = line.split(" ")[1];
          sf.stdin.write("quit\n");
          resolve({ evalCp, mate, bestMove });
        }
      }
    });
  });
};
