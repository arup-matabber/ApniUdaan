"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Star, TrendingUp, IndianRupee, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CareersSection({ data }) {
  const { t } = useTranslation();
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold">{t("recommendations_1.careers.noRecommendations")}</h3>
          <p className="text-gray-600">{t("recommendations_1.careers.noRecommendationsDesc")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {safeData.map((career) => (
        <Card key={career._id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-orange-100 text-orange-800">{career.industry}</Badge>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm">
                  {career.matchScore}% {t("recommendations_1.careers.match")}
                </span>
              </div>
            </div>
            <CardTitle className="text-lg">{career.title}</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-gray-600 mb-4">{career.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <IndianRupee className="h-4 w-4 mr-2" />
                <span>₹{career.averageSalary?.toLocaleString()} {t("recommendations_1.careers.perYear")}</span>
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>{career.growthRate} {t("recommendations_1.careers.jobGrowth")}</span>
              </div>
            </div>

            <Button className="w-full bg-transparent" variant="outline">
              {t("recommendations_1.careers.exploreCareer")}
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
