// QuizResults.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import {
  ArrowLeft,
  TrendingUp,
  BookOpen,
  Target,
  GraduationCap,
  Star,
  MapPin,
  Award,
  Trophy,
  Zap,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

/**
 * QuizResults.jsx
 * - Validates data fixtures (Remark 1)
 * - Renders only validated items
 * - Shows readable validation messages
 * - Accessible & resilient rendering when partial/complete data invalid
 */

/* --------------------------
   Mock aggregated results — replace with API data
   (Keep these fixtures for development; in prod these come from APIs)
   -------------------------- */
const MOCK_STREAM_SCORES = {
  Science: 0.78,
  Arts: 0.54,
  Commerce: 0.46,
  Vocational: 0.35,
};

const MOCK_CAREERS = [
  { title: "Software Engineer", stream: "Science", icon: "💻", description: "Build the future with code" },
  { title: "Research Scientist", stream: "Science", icon: "🔬", description: "Discover new knowledge" },
  { title: "Creative Writer", stream: "Arts", icon: "✍️", description: "Tell stories that inspire" },
  { title: "Financial Analyst", stream: "Commerce", icon: "📊", description: "Shape financial futures" },
];

const MOCK_COLLEGES = [
  { id: "c1", name: "Govt. Science College", programs: ["B.Sc", "BCA"], location: "District A", rating: 4.2 },
  { id: "c2", name: "Govt. Arts College", programs: [], location: "District B", rating: 4.0 },
  { id: "c3", name: "Govt. Commerce College", programs: ["B.Com", "BBA"], location: "District C", rating: 4.1 },
  { id: "c4", name: "Govt. Vocational College", programs: ["Diploma", "ITI"], location: "District D", rating: 3.9 },
];

/* --------------------------
   Validation helpers (Remark 1)
   - Validate stream scores object: keys non-empty strings, values numeric in 0..1
   - Validate careers array: each must have title & stream & description
   - Validate colleges array: each must have id & name
   -------------------------- */
function validateStreamScores(raw) {
  const errors = [];
  if (!raw || typeof raw !== "object") {
    errors.push("Stream scores should be an object.");
    return { valid: {}, errors };
  }
  const out = {};
  Object.entries(raw).forEach(([k, v]) => {
    if (!k || typeof k !== "string") {
      errors.push(`Invalid stream key: ${String(k)}`);
      return;
    }
    const num = Number(v);
    if (Number.isFinite(num) && num >= 0 && num <= 1) {
      out[k] = num;
    } else {
      errors.push(`Invalid score for '${k}': must be number between 0 and 1`);
    }
  });
  return { valid: out, errors };
}

function validateCareers(raw) {
  const errors = [];
  if (!Array.isArray(raw)) {
    errors.push("Careers data should be an array.");
    return { valid: [], errors };
  }
  const out = raw.filter((c, i) => {
    const missing = [];
    if (!c || typeof c !== "object") {
      errors.push(`Career[${i}] is not an object`);
      return false;
    }
    if (!c.title || typeof c.title !== "string") missing.push("title");
    if (!c.stream || typeof c.stream !== "string") missing.push("stream");
    if (!c.description || typeof c.description !== "string") missing.push("description");
    if (missing.length) {
      errors.push(`Career '${c.title || `#${i}`}' missing: ${missing.join(", ")}`);
      return false;
    }
    return true;
  });
  return { valid: out, errors };
}

function validateColleges(raw) {
  const errors = [];
  if (!Array.isArray(raw)) {
    errors.push("Colleges data should be an array.");
    return { valid: [], errors };
  }
  const out = raw.filter((c, i) => {
    const missing = [];
    if (!c || typeof c !== "object") {
      errors.push(`College[${i}] is not an object`);
      return false;
    }
    if (!c.id || typeof c.id !== "string") missing.push("id");
    if (!c.name || typeof c.name !== "string") missing.push("name");
    if (!Array.isArray(c.programs)) missing.push("programs");
    if (missing.length) {
      errors.push(`College '${c.name || `#${i}`}' missing: ${missing.join(", ")}`);
      return false;
    }
    return true;
  });
  return { valid: out, errors };
}

/* --------------------------
   Utility transforms
   -------------------------- */
const toRadarData = (scoresObj) => {
  return Object.entries(scoresObj).map(([stream, score]) => ({
    subject: stream,
    A: Math.round(score * 100),
    fullMark: 100,
  }));
};

const percent = (v = 0) => `${Math.round((Number(v) || 0) * 100)}%`;

/* --------------------------
   Main component
   -------------------------- */
const QuizResults = () => {
  const navigate = useNavigate();

  // validated data & errors state
  const [validationMessages, setValidationMessages] = useState([]);

  // Validate on first render
  const { valid: validStreams, errors: streamErrors } = useMemo(() => validateStreamScores(MOCK_STREAM_SCORES), []);
  const { valid: validCareersRaw, errors: careersErrors } = useMemo(() => validateCareers(MOCK_CAREERS), []);
  const { valid: validCollegesRaw, errors: collegesErrors } = useMemo(() => validateColleges(MOCK_COLLEGES), []);

  // Build combined validation messages (if any)
  useEffect(() => {
    const messages = [];
    if (streamErrors.length) messages.push(...streamErrors.map((m) => `Streams: ${m}`));
    if (careersErrors.length) messages.push(...careersErrors.map((m) => `Careers: ${m}`));
    if (collegesErrors.length) messages.push(...collegesErrors.map((m) => `Colleges: ${m}`));
    setValidationMessages(messages);
  }, [streamErrors, careersErrors, collegesErrors]);

  // If there are no valid streams at all, we cannot continue: show fallback
  const hasValidStreams = Object.keys(validStreams).length > 0;
  const filteredCareers = validCareersRaw.filter((c) => hasValidStreams ? Object.prototype.hasOwnProperty.call(validStreams, c.stream) : true);
  const filteredColleges = validCollegesRaw; // colleges are independent; show validated ones

  // compute sorted streams
  const sortedStreams = useMemo(() => {
    if (!hasValidStreams) return [];
    return Object.entries(validStreams).sort((a, b) => b[1] - a[1]);
  }, [validStreams, hasValidStreams]);

  const topStream = sortedStreams.length ? sortedStreams[0] : null;
  const radarData = sortedStreams.length ? toRadarData(Object.fromEntries(sortedStreams)) : [];

  // If everything invalid, show a robust fallback
  const everythingInvalid = !hasValidStreams && filteredCareers.length === 0 && filteredColleges.length === 0;

  if (everythingInvalid) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto text-center py-24">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Results unavailable</h2>
          <p className="text-gray-700 mb-6">
            We could not generate results because the result data appears to be invalid or missing. Please try again later or contact support.
          </p>
          <div className="space-x-3">
            <Button onClick={() => navigate("/quiz")} className="px-6 py-3">
              Back to Assessments
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()} className="px-6 py-3">
              Retry
            </Button>
          </div>
          {validationMessages.length > 0 && (
            <div className="mt-6 text-left bg-yellow-50 p-3 rounded-md text-sm text-yellow-800">
              <div className="font-semibold mb-2">Validation details:</div>
              <ul className="list-disc list-inside space-y-1">
                {validationMessages.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* --------------------------
     Render page with validated subsets
     -------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* ---------------------------
          DATA VALIDATION BANNER
         --------------------------- */}
          {validationMessages && validationMessages.length > 0 && (
            <div className="w-full bg-red-600 text-white rounded-lg p-3 mb-4 shadow-lg text-center font-semibold">
              ⚠ Data validation warnings present — open the developer panel below for details.
            </div>
          )}
        {/* Back button */}
        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={() => navigate("/quiz")}
            className="bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to Assessments
          </Button>

          {validationMessages.length > 0 && (
            <div
              role="status"
              aria-live="polite"
              className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-100 px-3 py-2 rounded-md"
              title="Validation warnings"
            >
              ⚠️ Some data issues detected — using validated subset.
            </div>
          )}
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">🎯 Your Personalized Career Report</h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Based on your quiz responses, here are your recommended streams, career paths, and nearby government colleges.
          </p>
        </div>

        {/* Top Stream Highlight (if available) */}
        {topStream ? (
          <Card className="overflow-hidden rounded-3xl shadow-xl border border-blue-300">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-center">
              <CardTitle className="text-3xl font-extrabold text-white flex justify-center items-center gap-3">
                <TrendingUp className="h-7 w-7 text-white" />
                Top Recommended Stream
              </CardTitle>
            </div>

            <CardContent className="p-8 bg-white">
              <div className="inline-block bg-gradient-to-r from-blue-200 to-indigo-300 text-blue-900 px-6 py-3 rounded-full text-xl font-bold shadow-lg mb-6">
                {topStream[0]}
              </div>

              <div className="text-4xl font-extrabold text-gray-900 mb-4">{Math.round(topStream[1] * 100)}% Match</div>
              <p className="text-gray-700 max-w-xl mx-auto leading-relaxed">
                This stream aligns <span className="font-semibold">best with your interests</span> and aptitudes.
                Explore related degree programs and nearby government colleges to plan your next steps.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden rounded-3xl shadow-xl border border-gray-200">
            <CardContent className="p-8 text-center">
              <div className="text-xl font-semibold text-gray-800 mb-2">No top stream available</div>
              <p className="text-gray-600">We couldn't determine a top stream from the available data.</p>
            </CardContent>
          </Card>
        )}

        {/* Stream Scores Radar Chart (if streams available) */}
        {radarData.length > 0 && (
          <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Target className="h-6 w-6 text-indigo-600" /> Stream Compatibility Radar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Compatibility"
                      dataKey="A"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {sortedStreams.map(([stream, score], idx) => {
                  const percentVal = Math.round(score * 100);
                  const colorMap = {
                    Science: "from-blue-500 to-cyan-500",
                    Arts: "from-pink-500 to-rose-500",
                    Commerce: "from-yellow-500 to-orange-500",
                    Vocational: "from-teal-500 to-green-500",
                  };
                  const gradient = colorMap[stream] || "from-gray-500 to-gray-600";

                  return (
                    <motion.div
                      key={stream}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      whileHover={{ scale: 1.03 }}
                      className={`bg-gradient-to-r ${gradient} text-white p-4 rounded-xl shadow-lg`}
                    >
                      <div className="font-bold text-lg">{stream}</div>
                      <div className="text-2xl font-extrabold">{percentVal}%</div>
                      {idx === 0 && <div className="text-xs bg-white/20 px-2 py-1 rounded-full mt-1">Top Match</div>}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Career Path Collection (render validated careers only) */}
        <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <BookOpen className="h-6 w-6 text-green-600" /> Career Path Collection
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCareers.length === 0 ? (
              <div className="text-center text-gray-600 p-8">No valid career suggestions available.</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredCareers.map((career, idx) => (
                  <motion.div
                    key={`${career.title}-${idx}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.06 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    className="relative bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border-2 border-gray-200 hover:border-green-300 transition-all cursor-pointer"
                  >
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full p-2 shadow-lg">
                      <Award className="h-4 w-4" />
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{career.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900 mb-1">{career.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{career.stream} Stream</p>
                        <p className="text-gray-700 text-sm">{career.description}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Match</span>
                        <span>{percent(MOCK_STREAM_SCORES[career.stream])}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.round((validStreams[career.stream] || 0) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Nearby Colleges (validated) */}
        <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <GraduationCap className="h-6 w-6 text-purple-600" /> Nearby Government Colleges
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredColleges.length === 0 ? (
              <div className="text-center text-gray-600 p-8">No valid college data available.</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredColleges.map((col, idx) => (
                  <motion.div
                    key={col.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-2xl shadow-lg border-2 border-gray-200 hover:border-purple-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900 mb-1">{col.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 text-red-500" />
                          <span>{col.location}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < Math.floor(col.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">({col.rating})</span>
                        </div>
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">Programs:</span> {col.programs.join(", ")}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to="/colleges">
                          <Button size="sm" variant="outline" className="rounded-xl border-purple-300 text-purple-700 hover:bg-purple-50">
                            View Details
                          </Button>
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600">
                          <Trophy className="h-4 w-4 mr-1" /> Bookmark
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/recommendations">
            <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg">View Recommendations</Button>
          </Link>
          <Link to="/colleges">
            <Button variant="outline" className="rounded-lg">Explore Colleges</Button>
          </Link>
          <Link to="/timeline">
            <Button variant="outline" className="rounded-lg">Track Timelines</Button>
          </Link>
        </div>

        {/* Developer validation panel (collapsible / informational) */}
        {validationMessages.length > 0 && (
          <div className="mt-6 bg-yellow-50 border border-yellow-100 p-4 rounded-md text-sm text-yellow-800 max-w-4xl mx-auto">
            <div className="font-semibold mb-2">Data validation warnings</div>
            <ul className="list-disc list-inside space-y-1">
              {validationMessages.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizResults;
