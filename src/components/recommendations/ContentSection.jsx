"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Star, Clock, Users, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ContentSection({ data }) {
  const { t } = useTranslation();
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold">{t("recommendations_1.content.noRecommendations")}</h3>
          <p className="text-gray-600">{t("recommendations_1.content.noRecommendationsDesc")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {safeData.map((content) => (
        <Card key={content._id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-indigo-100 text-indigo-800">{content.type}</Badge>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm text-gray-600">{content.rating}/5</span>
              </div>
            </div>
            <CardTitle className="text-lg">{content.title}</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-gray-600 mb-4">{content.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                <span>{content.duration}</span>
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-2" />
                <span>{content.enrollments} {t("recommendations_1.content.enrolled")}</span>
              </div>
            </div>

            <Button className="w-full bg-transparent" variant="outline">
              {t("recommendations_1.content.accessContent")}
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
