// src/components/profile/ProfilePage.jsx
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Camera,
  CheckCircle2,
  Clock,
  Edit3,
  GraduationCap,
  MapPin,
  Medal,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  User,
  BookOpen,
  Bookmark,
  Mail,
} from "lucide-react";

/**
 * Modern Dashboard-Style Profile
 * - Gradient/wave header with floating avatar
 * - Animated stat cards
 * - Pill tabs
 * - Filled mock data
 * - Fully responsive
 */

const mockProfile = {
  name: "Aarav Gupta",
  email: "aarav.gupta@example.com",
  location: "Delhi, India",
  class: "Class 12th",
  stream: "Science",
  joined: "2025-04-09T00:00:00.000Z",
  avatar: "",
  interests: ["AI/ML", "Competitive Coding", "Mathematics", "Robotics"],
  bio:
    "Curious, goal-oriented learner aiming for CS at a top institute. Loves hackathons, open source, and mentoring juniors.",
  goals: [
    "Crack JEE with top percentile",
    "Publish an ML project on GitHub with 500⭐",
    "Get into a Tier-1 college for CSE",
  ],
  stats: {
    quizzes: 18,
    avgScore: 82,
    bookmarks: 12,
    streak: 9,
  },
};

const mockQuizzes = [
  {
    id: "q1",
    title: "Career Aptitude – Tech & Analytics",
    category: "Aptitude",
    difficulty: "Medium",
    completedAt: "2025-08-28",
    score: 88,
    duration: "18m",
    correct: 44,
    total: 50,
  },
  {
    id: "q2",
    title: "Logical Reasoning (Advanced)",
    category: "Reasoning",
    difficulty: "Hard",
    completedAt: "2025-08-22",
    score: 74,
    duration: "22m",
    correct: 37,
    total: 50,
  },
  {
    id: "q3",
    title: "CS Fundamentals Basics",
    category: "CS",
    difficulty: "Easy",
    completedAt: "2025-08-14",
    score: 90,
    duration: "15m",
    correct: 45,
    total: 50,
  },
];

const mockBookmarks = [
  {
    id: "b1",
    type: "College",
    title: "IIT Delhi – B.Tech CSE",
    description:
      "Top ranked institute with excellent CS research and industry connect.",
    bookmarkedAt: "2025-08-20",
  },
  {
    id: "b2",
    type: "Course",
    title: "NPTEL: Intro to Machine Learning",
    description:
      "Hands-on ML with assignments and graded quizzes; great for fundamentals.",
    bookmarkedAt: "2025-08-18",
  },
  {
    id: "b3",
    type: "Article",
    title: "How to build a winning portfolio as a student",
    description:
      "Step-by-step guide to showcasing projects and achievements effectively.",
    bookmarkedAt: "2025-08-10",
  },
];

const mockAchievements = [
  {
    id: "a1",
    icon: "trophy",
    title: "Quiz Champion",
    description: "Scored 90%+ in 3 consecutive quizzes",
    points: 120,
    earnedAt: "2025-08-14",
    category: "Performance",
  },
  {
    id: "a2",
    icon: "medal",
    title: "7-Day Streak",
    description: "Maintained a 7 day learning streak",
    points: 70,
    earnedAt: "2025-08-12",
    category: "Consistency",
  },
  {
    id: "a3",
    icon: "sparkles",
    title: "Profile Star",
    description: "Completed profile 100%",
    points: 40,
    earnedAt: "2025-08-03",
    category: "Profile",
  },
];

const StatCard = ({ colorFrom, colorTo, Icon, label, value, subtitle }) => (
  <Card className="border-0 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
    <div
      className={`h-1.5 w-full bg-gradient-to-r ${colorFrom} ${colorTo}`}
    />
    <CardContent className="p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-xl p-2.5 bg-gray-100">
          <Icon className="h-5 w-5 text-gray-700" />
        </div>
        <div className="ml-auto text-right">
          <div className="text-2xl font-semibold leading-none">{value}</div>
          <div className="text-xs text-gray-500">{subtitle}</div>
        </div>
      </div>
      <div className="mt-3 text-sm font-medium text-gray-700">{label}</div>
    </CardContent>
  </Card>
);

export default function ProfilePage() {
  const [active, setActive] = useState("overview");

  const profile = mockProfile;
  const quizzes = mockQuizzes;
  const bookmarks = mockBookmarks;
  const achievements = mockAchievements;

  const joined = useMemo(
    () =>
      new Date(profile.joined).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    [profile.joined]
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_80%_-10%,#e9efff_10%,transparent_60%)]">
      {/* Modern Profile Hero */}
<section className="relative w-full">
  {/* Gradient Hero Background */}
  <div className="relative h-60 sm:h-72 bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600">
    <svg
      className="absolute bottom-0 w-full h-20 text-white"
      viewBox="0 0 1440 320"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        fill="white"
        fillOpacity="1"
        d="M0,128L40,138.7C80,149,160,171,240,176C320,181,400,171,480,176C560,181,640,203,720,192C800,181,880,139,960,144C1040,149,1120,203,1200,229.3C1280,256,1360,256,1400,256L1440,256L1440,0L0,0Z"
      ></path>
    </svg>

    {/* Floating Edit Profile */}
    <div className="absolute top-6 right-6">
      <Button className="px-5 py-2 gap-2 rounded-full shadow-lg bg-white text-blue-600 hover:bg-gray-100">
        <Edit3 className="h-4 w-4" /> Profile
      </Button>
    </div>
  </div>

  {/* Profile Card Overlap */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-24">
    <Card className="border-0 shadow-2xl rounded-3xl p-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-8">
        {/* Avatar */}
        <div className="relative">
          <div className="h-32 w-32 rounded-full border-4 border-white shadow-2xl bg-gray-100 grid place-items-center overflow-hidden ring-4 ring-indigo-200">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-14 w-14 text-gray-400" />
            )}
          </div>
          {/* Status dot */}
          <span className="absolute bottom-4 right-4 h-5 w-5 bg-green-500 border-2 border-white rounded-full shadow"></span>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            {profile.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700 flex items-center gap-1">
              <Mail className="h-4 w-4" /> {profile.email}
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700 flex items-center gap-1">
              <GraduationCap className="h-4 w-4" /> {profile.class} •{" "}
              {profile.stream}
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700 flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {profile.location}
            </span>
          </div>
          <p className="mt-4 text-gray-600 italic max-w-2xl leading-relaxed bg-gray-50 p-3 rounded-lg">
            {profile.bio}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
        {[
          {
            label: "Quizzes",
            value: profile.stats.quizzes,
            icon: BookOpen,
            color: "from-sky-400 to-blue-500",
          },
          {
            label: "Avg Score",
            value: `${profile.stats.avgScore}%`,
            icon: TrendingUp,
            color: "from-green-400 to-emerald-600",
          },
          {
            label: "Bookmarks",
            value: profile.stats.bookmarks,
            icon: Bookmark,
            color: "from-purple-400 to-fuchsia-600",
          },
          {
            label: "Streak",
            value: `${profile.stats.streak}d`,
            icon: Clock,
            color: "from-orange-400 to-red-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-white/70 backdrop-blur-md shadow-md hover:shadow-xl transform hover:-translate-y-1 transition"
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-full bg-gradient-to-r ${stat.color} text-white`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
</section>


      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <Tabs value={active} onValueChange={setActive} className="w-full">
          <TabsList className="w-full justify-start p-1 bg-white shadow-sm rounded-2xl overflow-x-auto">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-xl"
            >
              <User className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="academic"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-xl"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Academic
            </TabsTrigger>
            <TabsTrigger
              value="quizzes"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-xl"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Quiz History
            </TabsTrigger>
            <TabsTrigger
              value="bookmarks"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-xl"
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Bookmarks
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-xl"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Achievements
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left: Personal */}
              <Card className="lg:col-span-2 border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Personal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-gray-600">{profile.bio}</p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">
                        Email
                      </div>
                      <div className="mt-1 font-medium">{profile.email}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">
                        Joined
                      </div>
                      <div className="mt-1 font-medium">{joined}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">
                        Class / Stream
                      </div>
                      <div className="mt-1 font-medium">
                        {profile.class} • {profile.stream}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">
                        Location
                      </div>
                      <div className="mt-1 font-medium">{profile.location}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                      Interests
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="rounded-full px-3 py-1"
                        >
                          {i}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Right: Goals */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Career Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profile.goals.map((g, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-xl border p-3 hover:bg-gray-50 transition"
                    >
                      <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm">{g}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ACADEMIC */}
          <TabsContent value="academic" className="mt-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Academic Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-6">
                <div className="rounded-2xl border p-4">
                  <div className="text-sm text-gray-500">Current Class</div>
                  <div className="text-lg font-semibold mt-1">
                    {profile.class}
                  </div>
                </div>
                <div className="rounded-2xl border p-4">
                  <div className="text-sm text-gray-500">Stream</div>
                  <div className="text-lg font-semibold mt-1">
                    {profile.stream}
                  </div>
                </div>
                <div className="rounded-2xl border p-4">
                  <div className="text-sm text-gray-500">Focus Area</div>
                  <div className="text-lg font-semibold mt-1">
                    Competitive Programming + ML
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* QUIZ HISTORY */}
          <TabsContent value="quizzes" className="mt-6">
            <div className="space-y-4">
              {quizzes.map((q) => (
                <Card key={q.id} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{q.title}</h4>
                          <Badge variant="outline">{q.difficulty}</Badge>
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          {q.category} • {new Date(q.completedAt).toDateString()} •{" "}
                          {q.duration}
                        </div>
                        <div className="mt-3 h-2 w-56 rounded-full bg-gray-200">
                          <div
                            className={`h-2 rounded-full ${
                              q.score >= 80
                                ? "bg-green-500"
                                : q.score >= 60
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${q.score}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-semibold">{q.score}%</div>
                        <div className="text-xs text-gray-500">
                          {q.correct}/{q.total} correct
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* BOOKMARKS */}
          <TabsContent value="bookmarks" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((b) => (
                <Card
                  key={b.id}
                  className="border-0 shadow-sm hover:shadow-md transition"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline" className="capitalize">
                        {b.type}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(b.bookmarkedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="mt-3 font-semibold">{b.title}</h4>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-3">
                      {b.description}
                    </p>
                    <Button variant="outline" size="sm" className="mt-4">
                      <Bookmark className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ACHIEVEMENTS */}
          <TabsContent value="achievements" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((a) => (
                <Card
                  key={a.id}
                  className="border-0 shadow-sm hover:shadow-md transition"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-yellow-100 grid place-items-center">
                        {a.icon === "trophy" ? (
                          <Trophy className="h-6 w-6 text-yellow-600" />
                        ) : a.icon === "medal" ? (
                          <Medal className="h-6 w-6 text-yellow-600" />
                        ) : (
                          <Sparkles className="h-6 w-6 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{a.title}</div>
                        <div className="text-xs text-gray-500">
                          {a.category} •{" "}
                          {new Date(a.earnedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge className="ml-auto bg-yellow-100 text-yellow-800">
                        +{a.points}
                      </Badge>
                    </div>
                    <p className="mt-3 text-sm text-gray-600">{a.description}</p>
                  </CardContent>
                </Card>
              ))}
              {/* Bonus card */}
              <Card className="border-dashed border-2">
                <CardContent className="p-6 text-center">
                  <Star className="h-6 w-6 mx-auto text-gray-400" />
                  <div className="mt-2 font-medium">Unlock more badges</div>
                  <p className="text-sm text-gray-500">
                    Take quizzes and keep your streak to earn rewards.
                  </p>
                  <Button size="sm" className="mt-3">
                    Explore Quizzes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
