"use client";

import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Star, Users, MapPin, IndianRupee, Flame } from "lucide-react";

export default function CollegeCardWithSchoolTag({ college, schoolData, userSchool }) {
  const interest = college.interest || 0;

  // find entry for this user's school
  const entry = schoolData?.find((s) => s.college_id === college._id) || null;

  let schoolPercent = 0;
  if (entry && interest > 0) {
    schoolPercent = Math.round((entry.count / interest) * 100);
  }

  const showSchoolTag = userSchool && schoolPercent >= 60;

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            {college.type}
          </Badge>

          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm text-gray-600">{college.rating}/5</span>
          </div>
        </div>

        <CardTitle className="text-lg">{college.name}</CardTitle>

        {showSchoolTag && (
          <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1 rounded-full text-xs font-semibold text-red-700">
            <Flame className="h-4 w-4 text-red-600" />
            Popular Among Students of {userSchool} ({schoolPercent}%)
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{college.location}</span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-2" />
            <span>{college.studentsCount} students</span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <IndianRupee className="h-4 w-4 mr-2" />
            <span>₹{college.averageFee?.toLocaleString()} per year</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
