"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";

import { GraduationCap, BookOpen, Building, Briefcase } from "lucide-react";

import StreamsSection from "./StreamsSection";
import DegreesSection from "./DegreesSection";
import CollegesSection from "./CollegesSection";
import CareersSection from "./CareersSection";
import ContentSection from "./ContentSection";

import { getSampleRecommendations } from "./sampleRecommendations";

export default function ModernRecommendationsPage() {
  const { t, i18n } = useTranslation();

  const [sampleData, setSampleData] = useState({
    streams: [],
    degrees: [],
    careers: [],
    content: [],
  });

  const [colleges, setColleges] = useState([]); // 🔥 backend colleges
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("streams");

  useEffect(() => {
    loadAllData();
  }, [i18n.language]);

  async function loadAllData() {
    setLoading(true);

    // SAMPLE DATA for all other sections
    const sample = getSampleRecommendations(t);
    setSampleData({
      streams: sample.streams,
      degrees: sample.degrees,
      careers: sample.careers,
      content: sample.content,
    });

    // REAL COLLEGE DATA ONLY
    try {
      const res = await fetch("http://localhost:8080/api/colleges");
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        // Use only the required fields
        const mapped = json.data.map((c) => ({
          _id: c._id,
          name: c.name,
          location: c.location,
          type: c.type,
          rating: Number(c.rating) || 0,
          studentsCount: Number(c.studentsCount) || 0,
          averageFee: Number(c.averageFee) || 0,
          interest: Number(c.interest) || 0,
          image: c.image || null,
          website: c.website || null,
        }));

        setColleges(mapped);
      } else {
        setColleges([]);
      }
    } catch (err) {
      console.error("❌ Failed to load colleges:", err);
      setColleges([]);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">Loading…</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{t("recommendations_1.title")}</h1>
      <p className="text-lg mb-6">{t("recommendations_1.subtitle")}</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="streams">
            <GraduationCap className="h-4 w-4 mr-2" />
            {t("recommendations_1.tabs.streams")}
          </TabsTrigger>

          <TabsTrigger value="degrees">
            <BookOpen className="h-4 w-4 mr-2" />
            {t("recommendations_1.tabs.degrees")}
          </TabsTrigger>

          <TabsTrigger value="colleges">
            <Building className="h-4 w-4 mr-2" />
            {t("recommendations_1.tabs.colleges")}
          </TabsTrigger>

          <TabsTrigger value="careers">
            <Briefcase className="h-4 w-4 mr-2" />
            {t("recommendations_1.tabs.careers")}
          </TabsTrigger>

          <TabsTrigger value="content">
            <BookOpen className="h-4 w-4 mr-2" />
            {t("recommendations_1.tabs.content")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="streams">
          <StreamsSection data={sampleData.streams} />
        </TabsContent>

        <TabsContent value="degrees">
          <DegreesSection data={sampleData.degrees} />
        </TabsContent>

        <TabsContent value="colleges">
          {/* 🔥 ONLY REAL DATA HERE */}
          <CollegesSection data={colleges} />
        </TabsContent>

        <TabsContent value="careers">
          <CareersSection data={sampleData.careers} />
        </TabsContent>

        <TabsContent value="content">
          <ContentSection data={sampleData.content} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
