"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Star,
  Users,
  MapPin,
  IndianRupee,
  ExternalLink,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CollegesSection({
  data = [],
  userSchool: propUserSchool = null,
  apiBase = "http://localhost:8080",
}) {
  const { t } = useTranslation();
  const safeData = Array.isArray(data) ? data : [];

  const [schoolInterestMap, setSchoolInterestMap] = useState({});
  const [loadingInterest, setLoadingInterest] = useState(false);

  /* ---------------------------------------------
        Detect user school
    ------------------------------------------------*/
  const getUserSchool = () => {
    try {
      const raw = localStorage.getItem("apnidisha_student_profile");
      if (!raw) return "Unknown";

      const profile = JSON.parse(raw);
      if (profile && profile.school) return profile.school;
    } catch {}
    return "Unknown";
  };

  /* ---------------------------------------------
        Fetch school interest per college
    ------------------------------------------------*/
  useEffect(() => {
    const school = getUserSchool();
    let mounted = true;

    const fetchInterests = async () => {
      if (!safeData.length) return;

      setLoadingInterest(true);

      const promises = safeData.map((college) => {
        const url = `${apiBase}/api/school-interest/${college._id}/${school}`;

        return axios
          .get(url)
          .then((res) => ({ id: college._id, count: res.data?.count ?? 0 }))
          .catch(() => ({ id: college._id, count: 0 }));
      });

      const results = await Promise.all(promises);
      if (!mounted) return;

      const map = {};
      results.forEach((r) => (map[r.id] = r.count));

      setSchoolInterestMap(map);
      setLoadingInterest(false);
    };

    fetchInterests();
    return () => (mounted = false);
  }, [data]);

  /* ---------------------------------------------
        Compute popularity percentage
    ------------------------------------------------*/
  const computePct = (college) => {
    const schoolCount = schoolInterestMap[college._id] || 0;
    const globalInterest = Number(college.interest || 0);

    if (globalInterest === 0) return schoolCount > 0 ? 100 : 0;

    return Math.round((schoolCount / globalInterest) * 100);
  };

  const POPULAR_THRESHOLD = 40;

  /* ---------------------------------------------
        If no data
    ------------------------------------------------*/
  if (!safeData.length) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <h3 className="text-xl font-semibold">
            {t("recommendations_1.colleges.noRecommendations")}
          </h3>
          <p className="text-gray-600">
            {t("recommendations_1.colleges.noRecommendationsDesc")}
          </p>
        </CardContent>
      </Card>
    );
  }

  /* ---------------------------------------------
        UI
    ------------------------------------------------*/
  return (
    <div>
      {loadingInterest && (
        <div className="mb-4 text-sm text-gray-500">
          Loading school popularity...
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeData.map((college) => {
          const pct = computePct(college);
          const isPopular = pct >= POPULAR_THRESHOLD;

          return (
            <Card
              key={college._id}
              className="relative shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* ⭐ Pink Gradient Top Pick Badge */}
              {isPopular && (
                <div
                  className="
                    absolute top-2 right-2 
                    px-2 py-0.5 
                    text-[10px] font-semibold 
                    bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500
                    text-white 
                    rounded-full shadow-lg
                    animate-pulse
                    ring-1 ring-pink-300
                    backdrop-blur-sm
                    glow-badge-pink
                  "
                >
                  ★ Top Pick
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {college.name}
                    </CardTitle>

                    <div className="mt-2 flex gap-2 items-center">
                      <Badge className="bg-purple-100 text-purple-900">
                        {college.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-right">
                    <Star className="h-4 w-4 text-yellow-500 inline-block" />
                    <span>{college.rating}/5</span>
                    <div className="text-xs text-gray-500">
                      {pct > 0 ? `${pct}% from your school` : "—"}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {college.location}
                  </div>

                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    {college.studentsCount} students
                  </div>

                  <div className="flex items-center">
                    <IndianRupee className="h-4 w-4 mr-2" />
                    ₹{college.averageFee.toLocaleString()} per year
                  </div>
                </div>

                {college.website && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full flex items-center justify-center"
                  >
                    <a href={college.website} target="_blank">
                      Visit Website
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
