// src/components/ModernCollegeDirectory.jsx
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";

import {
  Search,
  MapPin,
  Star,
  Users,
  IndianRupee,
  Loader2,
  SlidersHorizontal,
  Heart,
} from "lucide-react";

import debounce from "lodash.debounce";

// -------------------------------
// Load student profile (from localStorage)
// -------------------------------
const PROFILE_KEY = "apnidisha_student_profile";
const loadProfile = () => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// -------------------------------
// API instance
// -------------------------------
const API = axios.create({
  baseURL: "http://127.0.0.1:8080/api",
  headers: { "Content-Type": "application/json" },
});

const ModernCollegeDirectory = () => {
  const location = useLocation();

  const student = loadProfile();
  const userSchool = student?.school || "Unknown";

  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    state: "",
    type: "",
    course: "",
    rating: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  // -------------------------------
  // Fetch Colleges
  // -------------------------------
  const fetchColleges = async (search = searchTerm, appliedFilters = filters) => {
    console.log("🔍 Fetching colleges with:", { search, appliedFilters });

    try {
      setLoading(true);
      const params = { search, ...appliedFilters, limit: 50 };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);

      const res = await API.get("/colleges", { params });
      const data = res.data?.data || [];

      console.log("📥 Backend response:", res.data);

      const totalInt =
        res.data?.totalInterest ||
        data.reduce((sum, c) => sum + (c.interest || 0), 0);

      setColleges(data);
      setTotalResults(res.data?.total || data.length);
      setTotalInterest(totalInt);
    } catch (err) {
      console.error("❌ Error fetching colleges:", err);
      setColleges([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useRef(
    debounce((value, currentFilters) => {
      fetchColleges(value, currentFilters);
    }, 400)
  ).current;

  useEffect(() => {
    fetchColleges();
  }, []);

  // -------------------------------
  // View Details (Update Global Interest + School Interest)
  // -------------------------------
  const handleViewDetails = async (college) => {
    const id = college._id;

    console.log("❤️ View Details clicked for:", college.name);
    console.log("🎓 User School:", userSchool);

    // 1. UI update instantly
    setColleges((prev) =>
      prev.map((c) =>
        c._id === id ? { ...c, interest: (c.interest || 0) + 1 } : c
      )
    );
    setTotalInterest((prev) => prev + 1);

    // 2. Global interest API update
    try {
      console.log("📤 Updating global interest...");
      await API.post("/colleges/interest-batch", {
        interest: { [id]: 1 },
      });
      console.log("✅ Global interest updated");
    } catch (error) {
      console.error("❌ Failed global interest update:", error);
    }

    // 3. School-specific interest update
    try {
      console.log("📤 Updating school interest...", {
        college_id: id,
        school: userSchool,
      });

      await API.post("/school-interest/increment", {
        college_id: id,
        school: userSchool,
      });

      console.log("🏫 School interest updated for:", userSchool);
    } catch (error) {
      console.error("❌ Failed school interest update:", error);
    }

    // 4. Redirect to website
    if (college.website) {
      console.log("🌐 Redirecting:", college.website);
      window.open(college.website, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = `/colleges/${id}`;
    }
  };

  const computeInterestPercent = (val) =>
    totalInterest > 0 ? `${Math.round((val / totalInterest) * 100)}%` : "0%";

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold">College Directory</h1>
          <p className="text-gray-600">
            Discover top colleges across India
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Search */}
        <Card className="border-0 shadow-lg mb-6">
          <CardContent className="p-7">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search colleges..."
                  value={searchTerm}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchTerm(value);
                    debouncedFetch(value, filters);
                  }}
                  className="pl-10 h-12"
                />
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 h-12"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Colleges Grid */}
        {loading ? (
          <div className="min-h-[200px] flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => {
              const pct = computeInterestPercent(college.interest || 0);

              return (
                <Card
                  key={college._id}
                  className="border-0 shadow-md hover:shadow-xl transition overflow-hidden"
                >
                  <div className="relative h-48">
                    <img
                      src={
                        college.image ||
                        "https://via.placeholder.com/600x300?text=College"
                      }
                      alt={college.name}
                      className="w-full h-full object-cover hover:scale-105 transition"
                    />

                    {/* Interest Badge */}
                    <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full flex items-center gap-2 text-xs">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span>Interested</span>
                      <Badge className="bg-blue-600 text-white text-[10px]">
                        {pct}
                      </Badge>
                    </div>

                    {/* School Badge */}
                    {/* {userSchool && (
                      <div className="absolute top-4 right-4 bg-pink-600 text-white px-2 py-1 rounded text-[10px] shadow">
                        {userSchool}
                      </div>
                    )} */}
                  </div>

                  <CardHeader className="pb-4">
                    <CardTitle className="line-clamp-2">
                      {college.name}
                    </CardTitle>

                    <div className="flex justify-end mt-2 text-sm">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      {college.rating ?? "-"}
                    </div>
                  </CardHeader>

                  <CardContent className="text-sm text-gray-600 space-y-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {college.location || "Location N/A"}
                    </div>

                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      {college.studentsCount
                        ? `${college.studentsCount} students`
                        : "Students: N/A"}
                    </div>

                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 mr-2 text-gray-400" />
                      ₹{college.averageFee?.toLocaleString() || "0"} per year
                    </div>

                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 mt-3"
                      onClick={() => handleViewDetails(college)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernCollegeDirectory;
