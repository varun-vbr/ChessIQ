import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Target,
  TrendingUp,
  Zap,
  ChevronRight,
  Sparkles,
  Brain,
  Award,
  ChevronDown,
  ChevronUp,
  ListChecks,
  FileText,
} from "lucide-react";

const TrainingPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [trainingPlans, setTrainingPlans] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3003/api/v1/training/plans`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const result = await response.json();

        if (result.status === "success") {
          setTrainingPlans(result.data.trainingPlans);
        } else {
          setError("Failed to load Training data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  async function handlePlanGeneration(e) {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3003/api/v1/training/train`,
        {
          method: "GET",
          credentials: "include", // keep if auth cookies are used
        },
      );
      const result = await response.json();

      if (result.status === "success") {
        trainingPlans.unshift(result.data.trainingPlan);
        setTrainingPlans(trainingPlans);
      } else {
        setError("Failed to generate Training data");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading Training data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!trainingPlans) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">No data available</div>
      </div>
    );
  }

  // Parse markdown plan to extract metadata
  const parsePlanMetadata = (plan) => {
    const lines = plan.split("\n");

    // Extract duration from plan header
    const durationMatch = plan.match(/(\d+)-week plan|(\d+) week/i);
    const duration = durationMatch
      ? `${durationMatch[1] || durationMatch[2]} weeks`
      : "Custom duration";

    // Extract daily time commitment
    const timeMatch = plan.match(/(\d+) min\/day/);
    const dailyTime = timeMatch ? `${timeMatch[1]} min/day` : "Varies";

    // Extract goals count
    const goalsMatch = plan.match(/##.*goals/i);
    const goalsSection = plan.substring(plan.indexOf(goalsMatch?.[0] || ""));
    const goalsList = goalsSection.match(/\d+\.\s+\*\*/g) || [];
    const goalsCount = goalsList.length;

    // Extract weaknesses from first section
    const weaknessMatches =
      plan.match(/\*\*([A-Za-z\s]+)\s+\((\d+)\)\*\*/g) || [];
    const weaknesses = weaknessMatches
      .slice(0, 3)
      .map((w) => {
        const match = w.match(/\*\*([A-Za-z\s]+)\s+\((\d+)\)\*\*/);
        return match ? match[1].trim() : "";
      })
      .filter(Boolean);

    // Extract title from first header or first line
    const titleMatch = plan.match(/^#\s+(.+)$/m);
    const title = titleMatch
      ? titleMatch[1]
      : plan
          .split("\n")
          .find((l) => l.trim() && !l.startsWith("#") && !l.startsWith("-"))
          ?.substring(0, 60) || "Training Plan";

    return {
      title,
      duration,
      dailyTime,
      goalsCount,
      weaknesses,
      description: plan.split("\n---")[0].substring(0, 150) + "...",
    };
  };

  const parseMarkdownSections = (markdown) => {
    const sections = [];
    const lines = markdown.split("\n");
    let currentSection = null;

    lines.forEach((line, index) => {
      // Main headers (single #)
      if (line.match(/^#\s+[^#]/)) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          type: "header",
          title: line.replace(/^#\s+/, ""),
          content: [],
          level: 1,
        };
      }
      // Subheaders (##)
      else if (line.match(/^##\s+/)) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          type: "subheader",
          title: line.replace(/^##\s+/, ""),
          content: [],
          level: 2,
        };
      }
      // Subsubheaders (###)
      else if (line.match(/^###\s+/)) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          type: "subsubheader",
          title: line.replace(/^###\s+/, ""),
          content: [],
          level: 3,
        };
      }
      // Content
      else if (currentSection && line.trim()) {
        currentSection.content.push(line);
      }
    });

    if (currentSection) sections.push(currentSection);
    return sections;
  };

  const renderMarkdownContent = (content) => {
    return content.map((line, idx) => {
      // Bold text
      let processed = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      // Italic text
      processed = processed.replace(/\*(.+?)\*/g, "<em>$1</em>");
      // Bullet points
      if (line.trim().startsWith("-")) {
        return (
          <li
            key={idx}
            className="ml-4 text-gray-700"
            dangerouslySetInnerHTML={{ __html: processed.replace(/^-\s*/, "") }}
          />
        );
      }
      // Numbered lists
      if (line.match(/^\d+\./)) {
        return (
          <li
            key={idx}
            className="ml-4 text-gray-700"
            dangerouslySetInnerHTML={{
              __html: processed.replace(/^\d+\.\s*/, ""),
            }}
          />
        );
      }
      return (
        <p
          key={idx}
          className="text-gray-700 mb-2"
          dangerouslySetInnerHTML={{ __html: processed }}
        />
      );
    });
  };

  const PlanCard = ({ plan }) => {
    const metadata = parsePlanMetadata(plan.plan);

    return (
      <div
        onClick={() => setSelectedPlan(plan)}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {metadata.title}
              </h3>
              <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full">
                <Sparkles className="w-3 h-3 text-purple-600" />
                <span className="text-xs font-medium text-purple-700">
                  AI Generated
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {metadata.description}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {metadata.weaknesses.map((weakness, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
            >
              {weakness}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(plan.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{metadata.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4" />
            <span>{metadata.dailyTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            <span>{metadata.goalsCount} goals</span>
          </div>
        </div>
      </div>
    );
  };

  const SectionCard = ({ section, planId }) => {
    const sectionKey = `${planId}-${section.title}`;
    const isExpanded = expandedSection === sectionKey;

    const getIcon = () => {
      const title = section.title.toLowerCase();
      if (title.includes("goal"))
        return <Target className="w-5 h-5 text-purple-600" />;
      if (title.includes("drill") || title.includes("daily"))
        return <Zap className="w-5 h-5 text-orange-600" />;
      if (title.includes("week") || title.includes("day"))
        return <Calendar className="w-5 h-5 text-blue-600" />;
      if (title.includes("data") || title.includes("analysis"))
        return <Brain className="w-5 h-5 text-green-600" />;
      return <FileText className="w-5 h-5 text-gray-600" />;
    };

    const getBgColor = () => {
      if (section.level === 1)
        return "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200";
      if (section.level === 2) return "bg-white border-gray-200";
      return "bg-gray-50 border-gray-100";
    };

    return (
      <div className={`rounded-lg border overflow-hidden ${getBgColor()}`}>
        <div
          onClick={() => setExpandedSection(isExpanded ? null : sectionKey)}
          className="p-4 cursor-pointer hover:bg-opacity-80 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex-shrink-0">{getIcon()}</div>
              <div className="flex-1">
                <h3
                  className={`font-semibold ${section.level === 1 ? "text-xl text-gray-900" : section.level === 2 ? "text-lg text-gray-800" : "text-base text-gray-700"}`}
                >
                  {section.title}
                </h3>
                {!isExpanded && section.content.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                    {section.content[0]?.replace(/\*\*/g, "").substring(0, 80)}
                    ...
                  </p>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 ml-4">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {isExpanded && section.content.length > 0 && (
          <div className="px-4 pb-4 pt-2 border-t border-gray-100">
            <div className="prose prose-sm max-w-none">
              {section.content[0]?.trim().startsWith("-") ||
              section.content[0]?.match(/^\d+\./) ? (
                <ul className="space-y-1">
                  {renderMarkdownContent(section.content)}
                </ul>
              ) : (
                <div className="space-y-2">
                  {renderMarkdownContent(section.content)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const PlanDetailView = ({ plan }) => {
    const metadata = parsePlanMetadata(plan.plan);
    const sections = parseMarkdownSections(plan.plan);

    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <button
            onClick={() => setSelectedPlan(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            <span>Back to Plans</span>
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  {metadata.title}
                </h1>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">
                    AI Generated
                  </span>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Created on{" "}
                {new Date(plan.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Duration</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {metadata.duration}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-sm">Daily Time</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {metadata.dailyTime}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Target className="w-4 h-4" />
                <span className="text-sm">Goals</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {metadata.goalsCount}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <ListChecks className="w-4 h-4" />
                <span className="text-sm">Sections</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {sections.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Training Plan Details
            </h2>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
              <Brain className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Personalized for You
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {sections.map((section, idx) => (
              <SectionCard key={idx} section={section} planId={plan._id} />
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">
                Ready to Start Your Training?
              </h3>
              <p className="text-blue-100 mb-4">
                Follow this AI-generated plan to improve your chess skills
                systematically
              </p>
            </div>
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold shadow-lg">
              Begin Training
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {!selectedPlan ? (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <Brain className="w-10 h-10 text-blue-600" />
                    Training Plans
                  </h1>
                  <p className="text-gray-600 text-lg">
                    AI-powered personalized training programs to improve your
                    chess skills
                  </p>
                </div>
                <button
                  onClick={handlePlanGeneration}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Generate New Plan
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {trainingPlans.length}
                      </p>
                      <p className="text-sm text-gray-600">Active Plans</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <Sparkles className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">100%</p>
                      <p className="text-sm text-gray-600">AI Generated</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <Target className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {trainingPlans.reduce((sum, plan) => {
                          const meta = parsePlanMetadata(plan.plan);
                          return sum + meta.goalsCount;
                        }, 0)}
                      </p>
                      <p className="text-sm text-gray-600">Total Goals</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your Training Plans
              </h2>
              {trainingPlans.map((plan) => (
                <PlanCard key={plan._id} plan={plan} />
              ))}
            </div>
          </>
        ) : (
          <PlanDetailView plan={selectedPlan} />
        )}
      </div>
    </div>
  );
};

export default TrainingPlans;
