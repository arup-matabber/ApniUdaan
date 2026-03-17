// QuizList.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Loader2,
  ArrowRight,
  Lock,
  Trophy,
  Zap,
  Heart,
  Brain,
  Target,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";

// Mock journey stages — replace with your API integration
const JOURNEY_STAGES = [
  {
    id: "stage-1",
    title: "Discover Your Interests",
    subtitle: "What sparks your curiosity?",
    description: "Uncover your passions and what makes you excited to learn.",
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    xp: 100,
    isUnlocked: true,
    isCompleted: false,
    badge: "Explorer",
  },
  {
    id: "stage-2",
    title: "Explore Your Aptitude",
    subtitle: "What are you naturally good at?",
    description:
      "Test your strengths in different areas like logic, creativity, and analysis.",
    icon: Brain,
    color: "from-blue-400 to-indigo-500",
    xp: 150,
    isUnlocked: true,
    isCompleted: false,
    badge: "Thinker",
  },
  {
    id: "stage-3",
    title: "Career Pathways",
    subtitle: "Where do your skills lead?",
    description:
      "Match your interests and aptitudes to exciting career options.",
    icon: Target,
    color: "from-green-400 to-emerald-500",
    xp: 200,
    isUnlocked: false,
    isCompleted: false,
    badge: "Pathfinder",
  },
  {
    id: "stage-4",
    title: "Stream Selection",
    subtitle: "Choose your academic path",
    description:
      "Get personalized recommendations for Arts, Science, Commerce, or Vocational streams.",
    icon: Award,
    color: "from-purple-400 to-violet-500",
    xp: 250,
    isUnlocked: false,
    isCompleted: false,
    badge: "Scholar",
  },
];

const QuizList = () => {
  const [loading] = useState(false);
  const [stages, setStages] = useState([]);
  const [error, setError] = useState("");

  // Chat state (keeping as-is since you may extend later)
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Hi! I’m your assistant. Ask me about streams, careers, or admissions.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- VALIDATION ADDED HERE ---
  useEffect(() => {
    try {
      if (!Array.isArray(JOURNEY_STAGES) || JOURNEY_STAGES.length === 0) {
        setError("No quizzes available at the moment.");
        return;
      }
      const validStages = JOURNEY_STAGES.filter(
        (s) =>
          s.id &&
          s.title &&
          s.description &&
          typeof s.xp === "number" &&
          s.icon
      );
      if (validStages.length === 0) {
        setError("Invalid quiz data found. Please try again later.");
        return;
      }
      setStages(validStages);
    } catch (err) {
      setError("Failed to load quizzes.");
    }
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "This is a mock AI reply. (Connect real Gemini/OpenAI here!)",
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-600">Loading assessments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r mb-4">
            🚀 Your Career Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Embark on an exciting adventure to discover your perfect academic
            path and unlock your dream career!
          </p>

          {/* XP Progress */}
          <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold text-gray-800">Total XP: 250</span>
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: "62.5%" }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>
            <span className="text-sm text-gray-600">Level 2</span>
          </div>
        </motion.div>

        {/* Journey Path */}
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-200 via-purple-200 to-pink-200 rounded-full hidden md:block" />

          <div className="space-y-16">
            {stages.map((stage, idx) => {
              const IconComponent = stage.icon;
              const isLeft = idx % 2 === 0;

              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  className={`flex items-center ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  } gap-8`}
                >
                  {/* Stage Card */}
                  <div
                    className={`flex-1 ${
                      isLeft ? "md:text-right" : "md:text-left"
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 ${
                        stage.isCompleted
                          ? "border-green-300 shadow-green-100"
                          : stage.isUnlocked
                          ? "border-indigo-300 shadow-indigo-100"
                          : "border-gray-300"
                      } p-8 max-w-lg mx-auto ${
                        !stage.isUnlocked ? "opacity-60" : ""
                      }`}
                    >
                      {stage.isCompleted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-4 -right-4 bg-green-500 text-white rounded-full p-2 shadow-lg"
                        >
                          <Trophy className="h-5 w-5" />
                        </motion.div>
                      )}

                      <div
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${stage.color} text-white mb-4 shadow-lg`}
                      >
                        <IconComponent className="h-8 w-8" />
                      </div>

                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {stage.title}
                      </h3>
                      <p className="text-indigo-600 font-medium mb-3">
                        {stage.subtitle}
                      </p>
                      <p className="text-gray-600 mb-6">{stage.description}</p>

                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <span>+{stage.xp} XP</span>
                        </div>
                        {stage.isCompleted && (
                          <Badge className="bg-green-100 text-green-800 border-green-300">
                            {stage.badge}
                          </Badge>
                        )}
                      </div>

                      {stage.isUnlocked ? (
                        <Link to={`/quiz/${stage.id}`}>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              className={`w-full bg-gradient-to-r ${stage.color} text-white border-0 rounded-xl py-3 font-semibold shadow-lg hover:shadow-xl`}
                            >
                              {stage.isCompleted ? "Review" : "Start"}{" "}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </motion.div>
                        </Link>
                      ) : (
                        <Button
                          disabled
                          className="w-full bg-gray-300 text-gray-500 rounded-xl py-3 font-semibold"
                        >
                          <Lock className="mr-2 h-4 w-4" /> Locked
                        </Button>
                      )}
                    </motion.div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="hidden md:flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg border-4 border-indigo-200">
                    <div
                      className={`w-6 h-6 rounded-full bg-gradient-to-r ${stage.color}`}
                    />
                  </div>

                  <div className="flex-1 hidden md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            🏆 Your Achievements
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl px-6 py-4 shadow-lg"
            >
              <Trophy className="h-8 w-8 mx-auto mb-2" />
              <div className="font-semibold">Explorer</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl px-6 py-4 shadow-lg opacity-60"
            >
              <Brain className="h-8 w-8 mx-auto mb-2" />
              <div className="font-semibold">Thinker</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-xl px-6 py-4 shadow-lg opacity-30"
            >
              <Target className="h-8 w-8 mx-auto mb-2" />
              <div className="font-semibold">Pathfinder</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizList;
