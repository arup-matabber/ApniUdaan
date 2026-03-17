import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  MapPin,
  Star,
  Target,
  Lightbulb,
  Play,
  CheckCircle,
  ArrowRight,
  Award,
  Users,
  TrendingUp,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { quizAPI, collegesAPI } from '../services/api';
import { contentAPI } from '../services/contentService';
import { useTranslation } from 'react-i18next';

const LandingPage = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    studentsGuided: 0,
    collegesListed: 0,
    careerPaths: 0,
    studyResources: 0
  });
  const [featuredQuiz, setFeaturedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000); // 4 seconds per slide
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [quizzesRes, collegesRes, contentRes] = await Promise.all([
        quizAPI.getAll(),
        collegesAPI.getAll(),
        contentAPI.getAll()
      ]);

      setStats({
        studentsGuided: quizzesRes.data.totalAttempts || 10000,
        collegesListed: collegesRes.data.colleges?.length || 500,
        careerPaths: 50,
        studyResources: contentRes.data.content?.length || 1000
      });

      if (quizzesRes.data.quizzes?.length > 0) {
        setFeaturedQuiz(quizzesRes.data.quizzes[0]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats({
        studentsGuided: 10000,
        collegesListed: 500,
        careerPaths: 50,
        studyResources: 1000
      });
    } finally {
      setLoading(false);
    }
  };

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1470&q=80', // student studying
      title: t('hero.slide1.title'),
      subtitle: t('hero.slide1.subtitle'),
    },
    {
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1470&q=80', // graduation ceremony
      title: t('hero.slide2.title'),
      subtitle: t('hero.slide2.subtitle'),
    },
    {
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1470&q=80', // career planning
      title: t('hero.slide3.title'),
      subtitle: t('hero.slide3.subtitle'),
    },
    {
      image: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1470&q=80', // students collaborating
      title: t('hero.slide4.title'),
      subtitle: t('hero.slide4.subtitle'),
    }
  ];

  const features = [
    {
      icon: <Target className="h-8 w-8 text-blue-600" />,
      title: t('features.quiz.title'),
      description: t('features.quiz.desc'),
    },
    {
      icon: <MapPin className="h-8 w-8 text-green-600" />,
      title: t('features.path.title'),
      description: t('features.path.desc'),
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-purple-600" />,
      title: t('features.colleges.title'),
      description: t('features.colleges.desc'),
    },
    {
      icon: <Calendar className="h-8 w-8 text-orange-600" />,
      title: t('features.timeline.title'),
      description: t('features.timeline.desc'),
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-pink-600" />,
      title: t('features.guidance.title'),
      description: t('features.guidance.desc'),
    }
  ];

  const journeySteps = [
    {
      step: t('journey.quiz'),
      icon: <Target className="h-6 w-6" />,
      description: t('journey.quizDesc'),
      color: "from-blue-500 to-blue-600"
    },
    {
      step: t('journey.stream'),
      icon: <Lightbulb className="h-6 w-6" />,
      description: t('journey.streamDesc'),
      color: "from-green-500 to-green-600"
    },
    {
      step: t('journey.careers'),
      icon: <TrendingUp className="h-6 w-6" />,
      description: t('journey.careersDesc'),
      color: "from-purple-500 to-purple-600"
    },
    {
      step: t('journey.colleges'),
      icon: <GraduationCap className="h-6 w-6" />,
      description: t('journey.collegesDesc'),
      color: "from-orange-500 to-orange-600"
    },
    {
      step: t('journey.timeline'),
      icon: <Calendar className="h-6 w-6" />,
      description: t('journey.timelineDesc'),
      color: "from-pink-500 to-pink-600"
    }
  ];

  const testimonials = [
    {
      name: t('testimonials.rahul.name'),
      class: t('testimonials.rahul.class'),
      text: t('testimonials.rahul.quote'),
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: t('testimonials.ananya.name'),
      class: t('testimonials.ananya.class'),
      text: t('testimonials.ananya.quote'),
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: t('testimonials.rohan.name'),
      class: t('testimonials.rohan.class'),
      text: t('testimonials.rohan.quote'),
      rating: 4,
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: t('testimonials.sneha.name'),
      class: t('testimonials.sneha.class'),
      text: t('testimonials.sneha.quote'),
      rating: 5,
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: t('testimonials.arjun.name'),
      class: t('testimonials.arjun.class'),
      text: t('testimonials.arjun.quote'),
      rating: 5,
      image: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: t('testimonials.priya.name'),
      class: t('testimonials.priya.class'),
      text: t('testimonials.priya.quote'),
      rating: 4,
      image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 1 },
    visible: {
      y: 20,
      opacity: 1,
      transition: {
        duration: 1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10 max-w-4xl px-6 text-center text-white">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg mb-6">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto drop-shadow-md mb-10">
                {heroSlides[currentSlide].subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/login">
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    <Lightbulb className="mr-2 h-5 w-5" />
                    {t('buttons.takeQuiz')}
                  </Button>
                </Link>
                <Link to="/colleges">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-full backdrop-blur-sm bg-white/10">
                    <MapPin className="mr-2 h-5 w-5" />
                    {t('buttons.exploreColleges')}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50 group">
                  <CardContent className="p-8">
                    <motion.div
                      className="flex justify-center mb-6"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full group-hover:shadow-lg transition-shadow">
                        {feature.icon}
                      </div>
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                    <motion.div
                      className="mt-4 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Journey Map Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('journey.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('journey.step1.description')}
            </p>
          </motion.div>

          <div className="relative">
            <div className="grid lg:grid-cols-5 gap-9">
              {journeySteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="text-center relative mt-6"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <motion.div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {step.icon}
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.step}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                  {index < journeySteps.length - 1 && (
                    <motion.div
                      className="hidden lg:block absolute top-5 -right-4 text-purple-400"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.5 }}
                    >
                      <ArrowRight className="h-6 w-6" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t('whyUs.title')}
            </h2>
            <p className="text-xl text-blue-100">
              {t('impact.subheading')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[
              { number: `${stats.studentsGuided.toLocaleString()}+`, label: t('stats.studentsGuided'), icon: <Users className="h-8 w-8" /> },
              { number: `${stats.collegesListed}+`, label: t('stats.collegesListed'), icon: <GraduationCap className="h-8 w-8" /> },
              { number: `${stats.careerPaths}+`, label: t('stats.careerPaths'), icon: <TrendingUp className="h-8 w-8" /> },
              { number: `${stats.studyResources}+`, label: t('stats.studyResources'), icon: <BookOpen className="h-8 w-8" /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-center mb-4 text-yellow-300">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {loading ? '...' : stat.number}
                </div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Trust Badges */}
          <motion.div
            className="flex flex-wrap justify-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <Award className="h-6 w-6 text-yellow-300 mr-3" />
              <span className="font-semibold">{t('impact.award')}</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <Shield className="h-6 w-6 text-green-300 mr-3" />
              <span className="font-semibold">{t('impact.collaboration')}</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <CheckCircle className="h-6 w-6 text-blue-300 mr-3" />
              <span className="font-semibold">{t('impact.verified')}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('testimonials.heading')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('testimonials.subheading')}
            </p>
          </motion.div>

          <div className="relative">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-6">
                    <img
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  </div>
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-lg text-gray-700 mb-6 italic">
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">{testimonials[currentTestimonial].name}</div>
                    <div className="text-gray-600">{testimonials[currentTestimonial].class}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="flex justify-center mt-8 space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevTestimonial}
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`mt-2 w-3 h-3 rounded-full transition-colors ${
                      index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={nextTestimonial}
                className="rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{t('scenarioBuilderTitle')}</h3>
              <p className="text-gray-400">
                {t('footer.description')}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t('footer.quickLinks')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/quiz" className="hover:text-white">{t('footer.careerQuiz')}</Link></li>
                <li><Link to="/colleges" className="hover:text-white">{t('footer.colleges')}</Link></li>
                <li><Link to="/content" className="hover:text-white">{t('footer.studyMaterials')}</Link></li>
                <li><Link to="/timeline" className="hover:text-white">{t('footer.timeline')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t('footer.resources')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/recommendations" className="hover:text-white">{t('footer.recommendations')}</Link></li>
                <li><Link to="/profile" className="hover:text-white">{t('footer.profile')}</Link></li>
                <li><Link to="/bookmarks" className="hover:text-white">{t('footer.savedItems')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t('footer.contact')}</h4>
              <p className="text-gray-400">
                {t('footer.contactDesc')}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;