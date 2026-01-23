import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import GameAnalysisBoard from "./GameAnalysisBoard";
import {
  Sidebar,
  SidebarBody,
  SidebarItem,
  SidebarSection,
  SidebarHeader,
  SidebarLabel,
} from "../components/sidebar";

export function GameArchive() {
  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allAnalysis, setAllAnalysis] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [gameTitle, setGameTitle] = useState("");
  console.log(allAnalysis);

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch("http://localhost:3000/api/v1/analysis/", {
          method: "GET",
          credentials: "include", // keep if auth cookies are used
        });

        if (!response.ok) {
          throw new Error("Failed to fetch analysis data");
        }

        const data = await response.json();
        console.log(data);
        // Transform API response → navItems
        const items = data.data.analyses.map((game) => ({
          label: `${game.data.headers.White} vs ${game.data.headers.Black}`,
          gameId: game._id,
        }));
        setAllAnalysis(data.data.analyses);
        setNavItems(items);
        setAnalysisData(allAnalysis[0]);
      } catch (err) {
        console.error("Error fetching games:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  const selectedAnalysis = (gameId) => {
    if (!gameId) return null;
    return allAnalysis.find((a) => a._id === gameId) || null;
  };
  function handleGameSelection(gameId, label) {
    const game = selectedAnalysis(gameId);
    console.log(game);
    setAnalysisData(game);
    setGameTitle(label);
    setSelectedGameId(gameId);
  }

  return (
    <div>
      <h1 className="text-4xl font-bold">Game Archive</h1>
      <p className="mt-2 text-gray-600">Game History.</p>

      <div className="flex w-full gap-6 mt-6 min-h-[calc(100vh-8rem)]">
        {/* Sidebar → 25% */}
        <aside className="w-1/4 border-r border-teal-200 dark:border-teal-900 bg-teal-50/40 dark:bg-zinc-900">
          <Sidebar>
            <SidebarHeader>
              <SidebarLabel className="text-teal-800 dark:text-teal-200 font-semibold">
                Games
              </SidebarLabel>
            </SidebarHeader>
            <SidebarBody>
              <SidebarSection>
                {loading && (
                  <div className="text-sm text-gray-500 px-3">
                    Loading games...
                  </div>
                )}

                {!loading && navItems.length === 0 && (
                  <div className="text-sm text-gray-500 px-3">
                    No games found
                  </div>
                )}

                {navItems.map(({ label, gameId }) => (
                  <SidebarItem
                    key={gameId}
                    current={selectedGameId === gameId}
                    onClick={() => handleGameSelection(gameId, label)}
                    className="data-current:bg-teal-100 data-current:text-teal-900
               dark:data-current:bg-teal-900/40 dark:data-current:text-teal-200
               hover:bg-teal-50 dark:hover:bg-white/5"
                  >
                    {label}
                  </SidebarItem>
                ))}
              </SidebarSection>
            </SidebarBody>
          </Sidebar>
        </aside>

        {/* Main content → 75% */}
        <main className="w-3/4">
          <h3 className="mb-4 text-2xl font-semibold text-teal-900 dark:text-teal-200">
            {gameTitle || "Game Analysis"}
          </h3>
          <div
            className="rounded-xl border border-teal-200/60 dark:border-teal-900
                bg-white dark:bg-zinc-900 p-6 shadow-sm min-h-[calc(100vh-8rem)]"
          >
            {analysisData ? (
              <GameAnalysisBoard analysis={analysisData} />
            ) : (
              <div className="text-sm text-gray-500 min-h-[calc(100vh-8rem)]">
                Select a game to view analysis
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default GameArchive;
