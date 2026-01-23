import { useState, useMemo, useEffect } from "react";
import { Button } from "../components/button";
import { Text } from "../components/text";

function GameAnalysisBoard({ analysis }) {
  const moves = useMemo(() => analysis?.data?.finalResult ?? [], [analysis]);
  const [index, setIndex] = useState(0);
  const [aiResponse, setAiResponse] = useState("");
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  useEffect(() => {
    if (analysis?._id) {
      setIndex(0);
    }
  }, [analysis?._id]);

  const currentMove = moves[index];

  function parseUciMove(uci) {
    if (!uci || uci.length < 4) return null;
    return {
      from: uci.slice(0, 2),
      to: uci.slice(2, 4),
    };
  }

  async function handleAISubmit(e) {
    e.preventDefault();
    setIsLoadingExplanation(true);
    setAiResponse(""); // Clear previous response

    try {
      const response = await fetch(
        "http://localhost:3003/api/v1/training/explain",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(currentMove),
        },
      );

      console.log(response);

      if (response.status !== 200) {
        setAiResponse("Failed to load explanation. Please try again.");
        return;
      }

      const result = await response.json();
      console.log(result);
      setAiResponse(result.data.explaination);
    } catch (error) {
      console.error("Error fetching explanation:", error);
      // Optionally set an error message
      setAiResponse("Failed to load explanation. Please try again.");
    } finally {
      setIsLoadingExplanation(false);
    }
  }

  // async function handleAISubmit(e) {
  //   e.preventDefault();
  //   const response = await fetch(
  //     "http://localhost:3003/api/v1/training/explain",
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //       body: JSON.stringify(currentMove),
  //     },
  //   );
  //   console.log(response);
  //   if (response.status !== 200) {
  //     return;
  //   }
  //   const result = await response.json();
  //   console.log(result);
  //   setAiResponse(result.data.explaination);
  // }

  const bestMoveArrow = useMemo(() => {
    if (!currentMove?.bestMove) return null;
    return parseUciMove(currentMove.bestMove);
  }, [currentMove]);

  // Parse FEN to get piece positions
  function parseFen(fen) {
    if (!fen) return {};
    const [position] = fen.split(" ");
    const ranks = position.split("/");
    const pieces = {};

    ranks.forEach((rank, rankIdx) => {
      let fileIdx = 0;
      for (const char of rank) {
        if (char >= "1" && char <= "8") {
          fileIdx += parseInt(char);
        } else {
          const file = String.fromCharCode(97 + fileIdx); // a-h
          const rankNum = 8 - rankIdx; // 8-1
          pieces[`${file}${rankNum}`] = char;
          fileIdx++;
        }
      }
    });

    return pieces;
  }

  const pieces = useMemo(() => {
    return currentMove?.fenAfter ? parseFen(currentMove.fenAfter) : {};
  }, [currentMove?.fenAfter]);

  // Unicode chess pieces
  const pieceSymbols = {
    K: "♔",
    Q: "♕",
    R: "♖",
    B: "♗",
    N: "♘",
    P: "♙",
    k: "♚",
    q: "♛",
    r: "♜",
    b: "♝",
    n: "♞",
    p: "♟",
  };

  function squareToCoords(square) {
    const file = square.charCodeAt(0) - 97; // a=0, h=7
    const rank = parseInt(square[1]) - 1; // 1=0, 8=7
    return { x: file * 60 + 30, y: (7 - rank) * 60 + 30 };
  }

  if (!currentMove) {
    return (
      <div className="text-gray-500 p-4 font-medium">
        Select a game to view analysis
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[480px] mx-auto">
      <div className="shadow-2xl rounded-sm overflow-hidden border-4 border-gray-800">
        <svg width="480" height="480" viewBox="0 0 480 480">
          {/* Board squares */}
          {Array.from({ length: 64 }).map((_, i) => {
            const rank = Math.floor(i / 8);
            const file = i % 8;
            const isLight = (rank + file) % 2 === 0;
            return (
              <rect
                key={i}
                x={file * 60}
                y={rank * 60}
                width={60}
                height={60}
                fill={isLight ? "#f0d9b5" : "#b58863"}
              />
            );
          })}

          {/* Best move arrow */}
          {bestMoveArrow &&
            (() => {
              const from = squareToCoords(bestMoveArrow.from);
              const to = squareToCoords(bestMoveArrow.to);
              const dx = to.x - from.x;
              const dy = to.y - from.y;
              const angle = Math.atan2(dy, dx);
              const length = Math.sqrt(dx * dx + dy * dy);
              const arrowLength = length - 15;

              return (
                <g>
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="10"
                      refX="9"
                      refY="3"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 10 3, 0 6"
                        fill="rgba(0, 180, 255, 0.8)"
                      />
                    </marker>
                  </defs>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={from.x + Math.cos(angle) * arrowLength}
                    y2={from.y + Math.sin(angle) * arrowLength}
                    stroke="rgba(0, 180, 255, 0.8)"
                    strokeWidth="8"
                    markerEnd="url(#arrowhead)"
                  />
                </g>
              );
            })()}

          {/* Pieces */}
          {Object.entries(pieces).map(([square, piece]) => {
            const file = square.charCodeAt(0) - 97;
            const rank = parseInt(square[1]) - 1;
            const x = file * 60;
            const y = (7 - rank) * 60;

            return (
              <text
                key={square}
                x={x + 30}
                y={y + 30}
                fontSize="48"
                textAnchor="middle"
                dominantBaseline="central"
                style={{ userSelect: "none" }}
              >
                {pieceSymbols[piece]}
              </text>
            );
          })}

          {/* Coordinates */}
          {["a", "b", "c", "d", "e", "f", "g", "h"].map((file, i) => (
            <text
              key={`file-${file}`}
              x={i * 60 + 55}
              y={475}
              fontSize="10"
              fill="#666"
              fontWeight="bold"
            >
              {file}
            </text>
          ))}
          {[8, 7, 6, 5, 4, 3, 2, 1].map((rank, i) => (
            <text
              key={`rank-${rank}`}
              x={5}
              y={i * 60 + 15}
              fontSize="10"
              fill="#666"
              fontWeight="bold"
            >
              {rank}
            </text>
          ))}
        </svg>
      </div>

      {/* MOVE INFO CARD */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-md">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Move {Math.ceil(currentMove.ply / 2)}{" "}
              {currentMove.ply % 2 === 1 ? "White" : "Black"}
            </p>
            <p className="text-xl font-black text-gray-800">
              Played: {currentMove.move}
            </p>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              <p className="text-sm font-semibold text-blue-600 uppercase">
                Best: {currentMove.bestMove}
              </p>
            </div>
          </div>

          <div
            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-tight ${
              currentMove.classification === "GOOD" ||
              currentMove.classification === "BEST"
                ? "bg-green-100 text-green-700 border border-green-200"
                : currentMove.classification === "INACCURACY"
                  ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                  : currentMove.classification === "MISTAKE"
                    ? "bg-orange-100 text-orange-700 border border-orange-200"
                    : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {currentMove.classification}
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex justify-between items-center bg-gray-900 p-3 rounded-xl shadow-lg">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="flex items-center gap-2 rounded-lg bg-gray-800 px-5 py-2.5 text-white font-bold hover:bg-gray-700 disabled:opacity-20 transition-colors"
        >
          <span>◀</span> Prev
        </button>

        <div className="flex flex-col items-center">
          <span className="text-white font-mono font-bold text-lg">
            {index + 1} / {moves.length}
          </span>
        </div>

        <button
          onClick={() => setIndex((i) => Math.min(moves.length - 1, i + 1))}
          disabled={index === moves.length - 1}
          className="flex items-center gap-2 rounded-lg bg-gray-800 px-5 py-2.5 text-white font-bold hover:bg-gray-700 disabled:opacity-20 transition-colors"
        >
          Next <span>▶</span>
        </button>
      </div>
      <Button onClick={handleAISubmit} className="w-full" color="teal">
        Get AI Explanation for Move
      </Button>
      {isLoadingExplanation ? (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-md">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
            <Text className="text-gray-600">Analyzing move with AI...</Text>
          </div>
        </div>
      ) : aiResponse ? (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-md">
          <Text>{aiResponse}</Text>
        </div>
      ) : null}
    </div>
  );
}

export default GameAnalysisBoard;
