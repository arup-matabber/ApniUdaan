// src/components/profile/NewProfilePage.jsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Activity,
  BarChart3,
  BookOpen,
  Bookmark,
  Calendar,
  Camera,
  GraduationCap,
  MapPin,
  Settings,
  Target,
  TrendingUp,
  Trophy,
  User,
} from "lucide-react";

const data = {
  name: "Sara Iyer",
  email: "sara.iyer@sample.edu",
  avatar: "",
  class: "Class 11th",
  stream: "Commerce",
  school: "Springfield High",
  location: "Mumbai, India",
  joinedDate: "2025-03-10",
  profileCompletion: 92,
  totalQuizzes: 14,
  averageScore: 76,
  totalBookmarks: 9,
  streakDays: 12,
  interests: ["Finance", "Case Studies", "Entrepreneurship"],
  careerGoals: ["Become an Investment Analyst", "Crack DU BCom (H)"],
};

export default function NewProfilePage() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 via-blue-600 to-fuchsia-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full border-4 border-white shadow-xl bg-white grid place-items-center overflow-hidden">
                  {data.avatar ? (
                    <img
                      src={data.avatar}
                      alt={data.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-indigo-600" />
                  )}
                </div>
                <Button
                  size="icon"
                  className="absolute -bottom-2 -right-2 rounded-full bg-white text-indigo-600 hover:bg-indigo-50"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{data.name}</h1>
                <div className="text-indigo-100">
                  {data.class} • {data.stream} — {data.school}
                </div>
                <div className="flex items-center gap-4 text-indigo-100/90 mt-1">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {data.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined{" "}
                    {new Date(data.joinedDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-semibold">
                  {data.profileCompletion}%
                </div>
                <div className="text-sm text-indigo-100">Profile Complete</div>
              </div>
              <Button className="bg-white text-indigo-700 hover:bg-indigo-50">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-sm hover:shadow-md transition">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold">{data.totalQuizzes}</div>
                <div className="text-sm text-gray-500">Quizzes Taken</div>
              </div>
              <BookOpen className="h-8 w-8 text-indigo-600" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm hover:shadow-md transition">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold">
                  {data.averageScore}%
                </div>
                <div className="text-sm text-gray-500">Average Score</div>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-600" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm hover:shadow-md transition">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold">
                  {data.totalBookmarks}
                </div>
                <div className="text-sm text-gray-500">Bookmarks</div>
              </div>
              <Bookmark className="h-8 w-8 text-fuchsia-600" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm hover:shadow-md transition">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold">{data.streakDays}</div>
                <div className="text-sm text-gray-500">Streak (days)</div>
              </div>
              <Activity className="h-8 w-8 text-amber-600" />
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="flex overflow-x-auto rounded-2xl bg-white shadow-sm p-1">
            {[
              { id: "overview", label: "Overview", icon: User },
              { id: "academic", label: "Academic", icon: GraduationCap },
              { id: "quizzes", label: "Quiz History", icon: BookOpen },
              { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
              { id: "achievements", label: "Achievements", icon: Trophy },
            ].map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm whitespace-nowrap transition ${
                    active
                      ? "bg-indigo-600 text-white shadow"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Overview */}
          {tab === "overview" && (
            <div className="grid lg:grid-cols-3 gap-6 mt-6">
              <Card className="lg:col-span-2 border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Passionate commerce student exploring the world of finance,
                    markets, and business strategy. Loves reading case studies
                    and building simple financial models in spreadsheets.
                  </p>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                      Interests
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {data.interests.map((i) => (
                        <Badge key={i} variant="secondary" className="rounded-full">
                          {i}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.careerGoals.map((g, i) => (
                    <div
                      key={i}
                      className="rounded-xl border p-3 hover:bg-gray-50 text-sm"
                    >
                      • {g}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Academic */}
          {tab === "academic" && (
            <div className="mt-6 grid md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="text-gray-500 text-sm">Class</div>
                  <div className="text-lg font-semibold mt-1">{data.class}</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="text-gray-500 text-sm">Stream</div>
                  <div className="text-lg font-semibold mt-1">{data.stream}</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="text-gray-500 text-sm">School</div>
                  <div className="text-lg font-semibold mt-1">{data.school}</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quizzes */}
          {tab === "quizzes" && (
            <div className="mt-6 space-y-4">
              {[
                { title: "Finance Basics", score: 81, date: "2025-08-25" },
                { title: "Business Case Aptitude", score: 74, date: "2025-08-19" },
                { title: "Logical Reasoning", score: 88, date: "2025-08-11" },
              ].map((q, i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{q.title}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(q.date).toDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-semibold">{q.score}%</div>
                        <div className="h-2 w-48 bg-gray-200 rounded-full mt-2">
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Bookmarks */}
          {tab === "bookmarks" && (
            <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  type: "Article",
                  title: "Understanding P/E Ratio",
                  desc: "A simple primer for students to read markets better.",
                  date: "2025-08-14",
                },
                {
                  type: "Course",
                  title: "Personal Finance 101",
                  desc: "Budgeting, saving, and investing basics.",
                  date: "2025-08-10",
                },
                {
                  type: "College",
                  title: "SRCC – B.Com (H)",
                  desc: "Top commerce college with great placement track record.",
                  date: "2025-07-30",
                },
              ].map((b, i) => (
                <Card key={i} className="border-0 shadow-sm hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline">{b.type}</Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(b.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="mt-3 font-semibold">{b.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{b.desc}</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      View
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Achievements */}
          {tab === "achievements" && (
            <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Finance Whiz",
                  points: 100,
                  desc: "Scored 80%+ in 5 finance quizzes",
                },
                {
                  title: "Consistency Star",
                  points: 60,
                  desc: "Maintained a 10 day streak",
                },
                {
                  title: "Profile Pro",
                  points: 30,
                  desc: "Completed profile 90%+",
                },
              ].map((a, i) => (
                <Card key={i} className="border-0 shadow-sm hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-yellow-100 grid place-items-center">
                        {i === 0 ? (
                          <Trophy className="h-6 w-6 text-yellow-600" />
                        ) : i === 1 ? (
                          <BarChart3 className="h-6 w-6 text-yellow-600" />
                        ) : (
                          <Target className="h-6 w-6 text-yellow-600" />
                        )}
                      </div>
                      <div className="font-semibold">{a.title}</div>
                      <Badge className="ml-auto bg-yellow-100 text-yellow-800">
                        +{a.points}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-3">{a.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
