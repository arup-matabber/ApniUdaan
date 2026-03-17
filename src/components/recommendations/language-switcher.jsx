"use client"

import { useTranslation } from "react-i18next"
import { Button } from "../ui/button"
import { Globe } from "lucide-react"

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "hi" : "en"
    i18n.changeLanguage(newLang)
  }

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-transparent"
    >
      <Globe className="h-4 w-4" />
      {i18n.language === "en" ? "हिंदी" : "English"}
    </Button>
  )
}

export default LanguageSwitcher
