const { Chess } = require("chess.js");
const stockfishWrapper = require("./../stockfish/stockfish");
const { loadECO } = require("./ecoLoader");
const AnalysisModel = require("./../models/analysisModel");
const mongoose = require("mongoose");

function parsePGN(pgn) {
  const chess = new Chess();
  chess.loadPgn(pgn);
  return chess.history(); // ["e4", "e5", "Nf3", ...]
}

function generatePositions(pgn) {
  const chess = new Chess();
  chess.loadPgn(pgn);

  const moves = chess.history();
  chess.reset();

  const positions = [];

  for (let i = 0; i < moves.length; i++) {
    const fenBefore = chess.fen();
    const move = moves[i];
    chess.move(move);
    const fenAfter = chess.fen();

    positions.push({
      ply: i + 1,
      move,
      fenBefore,
      fenAfter,
    });
  }

  return positions;
}

async function analyzeGame(positions) {
  const results = [];

  for (const pos of positions) {
    try {
      const evalResult = await stockfishWrapper.evaluateFen(pos.fenAfter);

      results.push({
        ...pos,
        ...evalResult,
      });
    } catch (e) {
      return new AppError(
        `Error evaluating position at ply ${pos.ply}: ${e}`,
        500
      );
    }
  }

  return results;
}

function computeCPL(beforeEval, afterEval) {
  if (beforeEval === null || afterEval === null) return 0;
  return Math.abs(afterEval - beforeEval);
}

function classifyMove(cpl) {
  if (cpl >= 200) return "BLUNDER";
  if (cpl >= 100) return "MISTAKE";
  if (cpl >= 50) return "INACCURACY";
  return "GOOD";
}

function enrich(results) {
  for (let i = 1; i < results.length; i++) {
    const prev = results[i - 1];
    const curr = results[i];

    curr.cpl = computeCPL(prev.evalCp, curr.evalCp);
    curr.classification = classifyMove(curr.cpl);
  }
  return results;
}

("use strict");

/* ============================================================
 * Weakness Enum
 * ============================================================
 */

const WEAKNESSES = Object.freeze({
  TACTICAL_BLINDNESS: "TACTICAL_BLINDNESS",
  KING_SAFETY: "KING_SAFETY",
  OPENING_DRIFT: "OPENING_DRIFT",
  MIDDLEGAME_PLANNING: "MIDDLEGAME_PLANNING",
  ENDGAME_CONVERSION: "ENDGAME_CONVERSION",
  PAWN_STRUCTURE: "PAWN_STRUCTURE",
  PIECE_COORDINATION: "PIECE_COORDINATION",
  POSITIONAL_MISJUDGMENT: "POSITIONAL_MISJUDGMENT",
  TIME_PRESSURE: "TIME_PRESSURE",
});

const TACTICAL_MOTIFS = Object.freeze({
  FORK: "FORK",
  PIN: "PIN",
  SKEWER: "SKEWER",
});

/* ============================================================
 * Threshold Configuration
 * ============================================================
 */

const THRESHOLDS = Object.freeze({
  INACCURACY: 50,
  MISTAKE: 100,
  BLUNDER: 200,

  OPENING_PLY: 10,
  ENDGAME_PLY: 41,

  KING_SAFETY_CPL: 120,
  TACTICAL_CPL: 150,
});

/* ============================================================
 * Public API
 * ============================================================
 */

function classifyMoveWeaknesses(move, context) {
  const tags = [];

  if (isTacticalBlindness(move)) tags.push(WEAKNESSES.TACTICAL_BLINDNESS);
  if (isKingSafety(move)) tags.push(WEAKNESSES.KING_SAFETY);
  if (isOpeningDrift(move, context)) tags.push(WEAKNESSES.OPENING_DRIFT);
  if (isMiddlegamePlanning(move, context))
    tags.push(WEAKNESSES.MIDDLEGAME_PLANNING);
  if (isEndgameConversion(move, context))
    tags.push(WEAKNESSES.ENDGAME_CONVERSION);
  if (isPawnStructure(move)) tags.push(WEAKNESSES.PAWN_STRUCTURE);
  if (isPieceCoordination(move, context))
    tags.push(WEAKNESSES.PIECE_COORDINATION);
  if (isPositionalMisjudgment(move, context))
    tags.push(WEAKNESSES.POSITIONAL_MISJUDGMENT);
  if (isTimePressure(move, context)) tags.push(WEAKNESSES.TIME_PRESSURE);

  return tags;
}

/* ============================================================
 * Weakness Rules
 * ============================================================
 */

/* ---------- Tactical Blindness ---------- */
function isTacticalBlindness(move) {
  return (
    move.cpl >= THRESHOLDS.TACTICAL_CPL &&
    (move.classification === "BLUNDER" ||
      (Array.isArray(move.tacticalMotifs) && move.tacticalMotifs.length > 0))
  );
}

/* ---------- King Safety ---------- */
function isKingSafety(move) {
  if (!move.fenBefore) return false;

  const uncastled = /KQ|kq/.test(move.fenBefore);
  const kingSideWeak =
    !move.fenBefore.includes("f2") ||
    !move.fenBefore.includes("g2") ||
    !move.fenBefore.includes("f7") ||
    !move.fenBefore.includes("g7");

  return move.cpl >= THRESHOLDS.KING_SAFETY_CPL && (uncastled || kingSideWeak);
}

/* ---------- Opening Drift ---------- */
function isOpeningDrift(move, context) {
  return move.ply <= THRESHOLDS.OPENING_PLY && context.evalFromPlayer <= -100;
}

/* ---------- Middlegame Planning ---------- */
function isMiddlegamePlanning(move, context) {
  if (!isMiddlegame(move)) return false;

  return (
    context.recentInaccuracies >= 3 &&
    move.cpl >= THRESHOLDS.INACCURACY &&
    (!move.tacticalMotifs || move.tacticalMotifs.length === 0)
  );
}

/* ---------- Endgame Conversion ---------- */
function isEndgameConversion(move, context) {
  return (
    isEndgame(move) &&
    context.maxEvalForPlayer >= 200 &&
    move.cpl >= THRESHOLDS.MISTAKE &&
    context.finalResult !== "WIN"
  );
}

/* ---------- Pawn Structure ---------- */
function isPawnStructure(move) {
  const pawnMove = /^[a-h][1-8]/.test(move.move);

  return (
    pawnMove &&
    move.cpl >= 80 &&
    (!move.tacticalMotifs || move.tacticalMotifs.length === 0)
  );
}

/* ---------- Piece Coordination ---------- */
function isPieceCoordination(move, context) {
  return (
    context.samePieceMovedTwice &&
    move.cpl >= 80 &&
    (!move.tacticalMotifs || move.tacticalMotifs.length === 0)
  );
}

/* ---------- Positional Misjudgment ---------- */
function isPositionalMisjudgment(move, context) {
  return (
    context.evalDrift >= 150 &&
    (!move.tacticalMotifs || move.tacticalMotifs.length === 0)
  );
}

/* ---------- Time Pressure ---------- */
function isTimePressure(move, context) {
  return (
    typeof move.clock === "number" &&
    move.clock <= 10 &&
    move.cpl >= THRESHOLDS.TACTICAL_CPL
  );
}

/* ============================================================
 * Phase Helpers
 * ============================================================
 */

function isMiddlegame(move) {
  return move.ply > THRESHOLDS.OPENING_PLY && move.ply < THRESHOLDS.ENDGAME_PLY;
}

function isEndgame(move) {
  return move.ply >= THRESHOLDS.ENDGAME_PLY;
}

function annotateMoves(moves, userColor) {
  const context = buildGameContext(moves, userColor);

  return moves.map((move) => {
    const weaknesses = classifyMoveWeaknesses(move, context);
    const motifs = detectTacticalMotifs(move);

    return {
      ...move,
      weaknessTags: weaknesses,
      tacticalMotifs: motifs,
      opening: context.opening,
    };
  });
}

function detectTacticalMotifs(move) {
  const motifs = [];

  if (move.cpl >= THRESHOLDS.TACTICAL_CPL) {
    if (looksLikeFork(move)) motifs.push(TACTICAL_MOTIFS.FORK);
    if (looksLikePin(move)) motifs.push(TACTICAL_MOTIFS.PIN);
    if (looksLikeSkewer(move)) motifs.push(TACTICAL_MOTIFS.SKEWER);
  }

  return motifs;
}

function looksLikeFork(move) {
  // Heuristic: Knight move + high CPL
  return move.move.startsWith("N") && move.cpl >= THRESHOLDS.BLUNDER_CPL;
}

function looksLikePin(move) {
  // Heuristic: Bishop or rook move with eval swing
  return (
    (move.move.startsWith("B") || move.move.startsWith("R")) &&
    move.cpl >= THRESHOLDS.TACTICAL_CPL
  );
}

function looksLikeSkewer(move) {
  // Heuristic: Queen or rook move causing large eval change
  return (
    (move.move.startsWith("Q") || move.move.startsWith("R")) &&
    move.cpl >= THRESHOLDS.BLUNDER_CPL
  );
}

function buildGameContext(moves, userColor) {
  let maxEvalForPlayer = 0;
  let evalDrift = 0;
  let recentInaccuracies = 0;
  let lastEval = null;
  let lastPiece = null;
  let samePieceMovedTwice = false;

  for (const m of moves) {
    const evalForPlayer = userColor === "WHITE" ? m.evalCp : -m.evalCp;

    maxEvalForPlayer = Math.max(maxEvalForPlayer, evalForPlayer);

    if (lastEval !== null) {
      evalDrift += Math.max(0, lastEval - evalForPlayer);
    }

    if (m.cpl >= 50) recentInaccuracies++;

    const piece = m.move[0];
    samePieceMovedTwice = piece === lastPiece;
    lastPiece = piece;

    lastEval = evalForPlayer;
  }

  return {
    maxEvalForPlayer,
    evalDrift,
    recentInaccuracies,
    samePieceMovedTwice,
    opening: detectECO(moves),
  };
}

function normalizeSAN(move) {
  return move
    .replace(/[!?+#]/g, "")
    .replace(/0-0-0/g, "O-O-O")
    .replace(/0-0/g, "O-O");
}

function extractMovesFromPGN(pgn) {
  return (
    pgn
      // remove move numbers (e.g. "1.", "23...")
      .replace(/\d+\.(\.\.)?/g, "")
      // collapse whitespace
      .trim()
      .split(/\s+/)
      // remove result markers
      .filter((m) => !["1-0", "0-1", "1/2-1/2", "*"].includes(m))
      // normalize SAN
      .map(normalizeSAN)
  );
}

function detectECO(moves, maxPlies = 20) {
  const ecoDB = loadECO();

  // Moves from analyzed game
  const gameMoves = moves.slice(0, maxPlies).map((m) => normalizeSAN(m.move));

  let bestMatch = null;
  let bestDepth = 0;

  for (const entry of ecoDB) {
    if (!entry.pgn) continue;

    const ecoMoves = extractMovesFromPGN(entry.pgn);

    if (ecoMoves.length > gameMoves.length) continue;

    let matched = true;
    for (let i = 0; i < ecoMoves.length; i++) {
      if (ecoMoves[i] !== gameMoves[i]) {
        matched = false;
        break;
      }
    }

    if (matched && ecoMoves.length > bestDepth) {
      bestMatch = entry;
      bestDepth = ecoMoves.length;
    }
  }

  if (!bestMatch) {
    return {
      eco: "UNKNOWN",
      name: "Unknown Opening",
      depth: 0,
    };
  }

  return {
    eco: bestMatch.eco,
    name: bestMatch.name,
    depth: bestDepth,
  };
}

async function computeAndStoreGameKPI(gameId, color) {
  const isWhite = color === "WHITE";

  const [kpi] = await AnalysisModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(gameId),
      },
    },

    // explode moves
    { $unwind: "$data.finalResult" },

    // FILTER BY PLY PARITY
    {
      $match: {
        $expr: {
          $eq: [{ $mod: ["$data.finalResult.ply", 2] }, isWhite ? 1 : 0],
        },
      },
    },

    // MAIN GROUP - count classifications BEFORE unwinding weaknesses
    {
      $group: {
        _id: "$_id",

        avgCpl: { $avg: "$data.finalResult.cpl" },

        blunders: {
          $sum: {
            $cond: [
              { $eq: ["$data.finalResult.classification", "BLUNDER"] },
              1,
              0,
            ],
          },
        },

        mistakes: {
          $sum: {
            $cond: [
              { $eq: ["$data.finalResult.classification", "MISTAKE"] },
              1,
              0,
            ],
          },
        },

        inaccuracies: {
          $sum: {
            $cond: [
              { $eq: ["$data.finalResult.classification", "INACCURACY"] },
              1,
              0,
            ],
          },
        },

        accuracySum: {
          $sum: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$data.finalResult.classification", "GOOD"] },
                  then: 100,
                },
                {
                  case: {
                    $eq: ["$data.finalResult.classification", "INACCURACY"],
                  },
                  then: 60,
                },
                {
                  case: {
                    $eq: ["$data.finalResult.classification", "MISTAKE"],
                  },
                  then: 30,
                },
                {
                  case: {
                    $eq: ["$data.finalResult.classification", "BLUNDER"],
                  },
                  then: 0,
                },
              ],
              default: 100,
            },
          },
        },

        totalMoves: { $sum: 1 },

        eco: { $first: "$data.finalResult.opening" },

        // Collect all weakness arrays
        allWeaknesses: {
          $push: "$data.finalResult.weaknessTags",
        },
      },
    },

    // Now flatten and count weaknesses
    {
      $project: {
        _id: 1,
        avgCpl: 1,
        blunders: 1,
        mistakes: 1,
        inaccuracies: 1,
        accuracySum: 1,
        totalMoves: 1,
        eco: 1,

        // Flatten all weakness arrays into single array
        weaknessList: {
          $reduce: {
            input: "$allWeaknesses",
            initialValue: [],
            in: { $concatArrays: ["$$value", "$$this"] },
          },
        },
      },
    },

    {
      $project: {
        _id: 1,

        color: { $literal: color },

        eco: {
          code: "$eco.eco",
          name: "$eco.name",
        },

        stats: {
          avgCpl: { $round: ["$avgCpl", 1] },

          blunders: "$blunders",
          mistakes: "$mistakes",
          inaccuracies: "$inaccuracies",

          accuracyPct: {
            $round: [{ $divide: ["$accuracySum", "$totalMoves"] }, 1],
          },
        },

        weaknessCounts: {
          $arrayToObject: {
            $map: {
              input: { $setUnion: ["$weaknessList", []] },
              as: "w",
              in: {
                k: "$$w",
                v: {
                  $size: {
                    $filter: {
                      input: "$weaknessList",
                      cond: { $eq: ["$$this", "$$w"] },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  ]);

  return kpi;
}

/* ============================================================
 * Exports
 * ============================================================
 */

module.exports = {
  WEAKNESSES,
  TACTICAL_MOTIFS,
  generatePositions,
  annotateMoves,
  analyzeGame,
  enrich,
  computeAndStoreGameKPI,
};
