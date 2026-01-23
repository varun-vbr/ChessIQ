import { useState } from "react";
import { ErrorMessage, Field, Label } from "../components/fieldset";
import { Textarea } from "../components/textarea";
import { Listbox, ListboxOption, ListboxLabel } from "../components/listbox";
import { Button } from "../components/button";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "../components/dialog";
const COLOR_OPTIONS = [
  { label: "White", value: "WHITE" },
  { label: "Black", value: "BLACK" },
];

export function AnalysisPage() {
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  let [isOpen, setIsOpen] = useState(false);
  const [pgn, setPgn] = useState("");
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState(new Map());
  const navigate = useNavigate();
  async function handleAnalysis(e) {
    e.preventDefault();
    const newErrors = new Map();
    if (!pgn || pgn.trim() === "") {
      newErrors.set("pgn", "PGN is required");
    }
    if (newErrors.size > 0) {
      setErrors(newErrors);
      return;
    }
    console.log("Submitting PGN for analysis:", pgn);
    setErrors(new Map());
    const structuredData = pgnToJson(pgn, color.value);
    console.log("Structured PGN Data:", structuredData);
    const response = await fetch("http://localhost:3000/api/v1/analysis/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(structuredData),
    });
    console.log(response);
    if (response.status !== 201) {
      const analysisErrors = new Map();
      analysisErrors.set("pgn", "Analysis failed. Please check your PGN.");
      setErrors(analysisErrors);
      return;
    }
    const result = await response.json();
    console.log(result);
    setResult(result);
    setIsOpen(true);
  }
  /**
   * Convert a PGN string into structured JSON
   * Compatible with ChessIQ pipeline
   */
  function pgnToJson(pgnString, userColor) {
    if (!pgnString || typeof pgnString !== "string") {
      throw new Error("Invalid PGN input");
    }

    // Normalize line endings
    const lines = pgnString.replace(/\r/g, "").split("\n");

    const headers = {};
    const moveLines = [];

    // --- Parse headers ---
    for (const line of lines) {
      const trimmed = line.trim();

      // Header line
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        const match = trimmed.match(/^\[(\w+)\s+"(.*)"\]$/);
        if (match) {
          const [, key, value] = match;
          headers[key] = value;
        }
      }
      // Move text
      else if (trimmed && !trimmed.startsWith(";")) {
        moveLines.push(trimmed);
      }
    }

    // --- Join move text ---
    const moves = moveLines.join(" ").replace(/\s+/g, " ").trim();

    return {
      pgn: {
        headers,
        moves,
      },
      userColor,
    };
  }

  return (
    <div className="mx-auto max-w-3xl px-4">
      <h1 className="text-4xl font-bold">Analysis Page</h1>
      <p className="mt-2 text-gray-600">Analyse your chess performance.</p>

      {/* PGN INPUT */}
      <Field className="mt-6">
        <Label>PGN</Label>
        <Textarea
          name="pgn"
          rows={14}
          placeholder="Paste your PGN here..."
          value={pgn}
          onChange={(e) => setPgn(e.target.value)}
        />
        {errors.has("pgn") && <ErrorMessage>{errors.get("pgn")}</ErrorMessage>}
      </Field>

      {/* COLOR SELECT */}
      <Field className="mt-6">
        <Label>Playing as</Label>

        <Listbox
          value={color}
          onChange={setColor}
          aria-label="Playing color"
          placeholder="Select color"
        >
          {COLOR_OPTIONS.map((option) => (
            <ListboxOption key={option.value} value={option}>
              <ListboxLabel>{option.label}</ListboxLabel>
            </ListboxOption>
          ))}
        </Listbox>
      </Field>
      <Button
        type="submit"
        onClick={handleAnalysis}
        className="mt-6 w-full"
        color="teal"
      >
        Analyse Game
      </Button>

      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Game Summary</DialogTitle>
        <DialogDescription>
          Please review the KPIs for this game.
        </DialogDescription>
        <DialogBody>
          {/*<Field>
            <Label>Color</Label>
            <p>{result ? result.data.kpi.color : "N/A"}</p>
          </Field> */}
          <Field className="w-full">
            <div className="flex w-full items-center justify-between">
              <Label>Color</Label>
              <p
                data-slot="control"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {result ? result.data.kpi.color : "N/A"}
              </p>
            </div>
          </Field>

          <Field className="w-full">
            <div className="flex w-full items-center justify-between">
              <Label>Accuracy</Label>
              <p
                data-slot="control"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {result ? result.data.kpi.stats.accuracyPct : "N/A"}
              </p>
            </div>
          </Field>

          <Field className="w-full">
            <div className="flex w-full items-center justify-between">
              <Label>Average Centipawn Loss</Label>
              <p
                data-slot="control"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {result ? result.data.kpi.stats.avgCpl : "N/A"}
              </p>
            </div>
          </Field>
          <Field className="w-full">
            <div className="flex w-full items-center justify-between">
              <Label>Blunders</Label>
              <p
                data-slot="control"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {result ? result.data.kpi.stats.blunders : "N/A"}
              </p>
            </div>
          </Field>
          <Field className="w-full">
            <div className="flex w-full items-center justify-between">
              <Label>Inaccuracies</Label>
              <p
                data-slot="control"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {result ? result.data.kpi.stats.inaccuracies : "N/A"}
              </p>
            </div>
          </Field>
          <Field className="w-full">
            <div className="flex w-full items-center justify-between">
              <Label>Mistakes</Label>
              <p
                data-slot="control"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {result ? result.data.kpi.stats.mistakes : "N/A"}
              </p>
            </div>
          </Field>
          <Field className="w-full">
            <div className="flex w-full items-center justify-between">
              <Label>Endgame Conversion</Label>
              <p
                data-slot="control"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {result
                  ? result.data.kpi.weaknessCounts.ENDGAME_CONVERSION
                  : "N/A"}
              </p>
            </div>
          </Field>
          <Field className="w-full">
            <div className="flex w-full items-center justify-between">
              <Label>King Safety</Label>
              <p
                data-slot="control"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {result ? result.data.kpi.weaknessCounts.KING_SAFETY : "N/A"}
              </p>
            </div>
          </Field>
          <Field className="w-full">
            <div className="flex w-full items-center justify-between">
              <Label>Middlegame Planning</Label>
              <p
                data-slot="control"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {result
                  ? result.data.kpi.weaknessCounts.MIDDLEGAME_PLANNING
                  : "N/A"}
              </p>
            </div>
          </Field>
          <Field className="w-full">
            <div className="flex w-full items-center justify-between">
              <Label>Pawn Structure</Label>
              <p
                data-slot="control"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {result ? result.data.kpi.weaknessCounts.PAWN_STRUCTURE : "N/A"}
              </p>
            </div>
          </Field>
          <Field className="w-full">
            <div className="flex w-full items-center justify-between">
              <Label>Positional Misjudgment</Label>
              <p
                data-slot="control"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {result
                  ? result.data.kpi.weaknessCounts.POSITIONAL_MISJUDGMENT
                  : "N/A"}
              </p>
            </div>
          </Field>
          <Field className="w-full">
            <div className="flex w-full items-center justify-between">
              <Label>Tactical Blindness</Label>
              <p
                data-slot="control"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {result
                  ? result.data.kpi.weaknessCounts.TACTICAL_BLINDNESS
                  : "N/A"}
              </p>
            </div>
          </Field>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            color="teal"
            onClick={() => {
              setIsOpen(false);
              navigate("/mainpage/games");
            }}
          >
            Detailed Analysis
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default AnalysisPage;
