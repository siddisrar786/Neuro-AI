
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CheckCircle, ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import LandingPage from "@/components/LandingPage";
import MultiStepForm from "@/components/MultiStepForm";
import FeedbackButton from "@/components/FeedbackButton";
import FeedbackAnalytics from "@/components/FeedbackAnalytics";
import DetailedFeedbackForm from "@/components/DetailedFeedbackForm";
import UserTestimonials from "@/components/UserTestimonials";
import VisitorTracker from "@/components/VisitorTracker";

interface DiagnosisResult {
  prediction: string;
  class_index: number;
  confidence_percent: string;
  ai_advice: string;
}

interface FormData {
  file: File | null;
  patientName: string;
  age: string;
  height: string;
  weight: string;
  bmi: string;
  symptoms: string[];
  manualSymptoms: string;
}

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [completedFormData, setCompletedFormData] = useState<FormData | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFormComplete = (diagnosisResult: DiagnosisResult, formData: FormData, imageUrl: string | null) => {
    setResult(diagnosisResult);
    setCompletedFormData(formData);
    setUploadedImageUrl(imageUrl);
    toast({
      title: "Analysis Complete",
      description: "MRI scan has been successfully analyzed by our AI models.",
    });
  };

  const formatAiAdvice = (advice: string) => {
    // Remove special characters like colons and extra dots, clean formatting
    const cleanAdvice = advice
      .replace(/[:\*]/g, '') // Remove colons and asterisks
      .replace(/\.{2,}/g, '.') // Replace multiple dots with single dot
      .replace(/\n{3,}/g, '\n\n'); // Replace multiple newlines with double newlines

    return cleanAdvice.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine && trimmedLine.length > 5) {
        // Check if line should be bold (typically headers or important points)
        const shouldBeBold = 
          trimmedLine.endsWith('.') && trimmedLine.length < 50 ||
          trimmedLine.toLowerCase().includes('recommendation') ||
          trimmedLine.toLowerCase().includes('advice') ||
          trimmedLine.toLowerCase().includes('important');

        if (shouldBeBold) {
          return (
            <p key={index} className="font-bold text-lg mt-4 mb-2 text-gray-800">
              {trimmedLine}
            </p>
          );
        } else {
          return (
            <p key={index} className="mb-3 text-gray-700 leading-relaxed">
              {trimmedLine}
            </p>
          );
        }
      }
      return null;
    });
  };

  const getStageColor = (stage: string) => {
    if (stage.toLowerCase().includes('normal')) return 'bg-green-500/20 text-green-700 border-green-500/30';
    if (stage.toLowerCase().includes('mild')) return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
    if (stage.toLowerCase().includes('moderate')) return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
    if (stage.toLowerCase().includes('severe')) return 'bg-red-500/20 text-red-700 border-red-500/30';
    return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
  };

  const handleStartOver = () => {
    setResult(null);
    setCompletedFormData(null);
    setUploadedImageUrl(null);
  };

  const openColabNotebook = () => {
    window.open('https://colab.research.google.com/drive/1VZsKF97n77H1h4VPAOBFV_j2kVTZ499X?usp=sharing', '_blank');
  };

  if (!showDashboard) {
    return (
      <div>
        <LandingPage onGetStarted={() => setShowDashboard(true)} />
        <UserTestimonials />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-6 border-b border-white/20 backdrop-blur-sm bg-white/30"
        >
          <div className="flex items-center gap-3">
            <Brain className="h-10 w-10 text-indigo-600" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Neuro AI Dashboard
              </h1>
              <p className="text-gray-600 text-sm">For students, professionals, researchers & doctors - verification purposes only</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <VisitorTracker />
            <Button
              variant="outline"
              onClick={() => setShowDashboard(false)}
              className="backdrop-blur-xl bg-white/50"
            >
              Back to Home
            </Button>
          </div>
        </motion.div>

        {/* Platform Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-6 mt-6 bg-gradient-to-r from-yellow-50/80 to-orange-50/80 backdrop-blur-sm border border-yellow-200/50 rounded-lg p-4 shadow-lg"
        >
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Important Disclaimer:</strong> This platform is currently in trial phase and is not medically proven. 
            Do not use for main diagnosis stream or rely on this platform until fully validated. For educational and verification purposes only.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-4xl mx-auto"
              >
                <MultiStepForm onComplete={handleFormComplete} />
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-7xl mx-auto"
              >
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">Analysis Complete</h2>
                      <p className="text-gray-600">Comprehensive AI-powered diagnosis report</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={openColabNotebook}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Training Steps
                    </Button>
                    <Button
                      onClick={handleStartOver}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      New Analysis
                    </Button>
                  </div>
                </div>

                {/* Horizontal Results Layout */}
                <div className="grid lg:grid-cols-12 gap-6 mb-8">
                  {/* Patient Summary & AI Diagnosis - Left Side */}
                  <div className="lg:col-span-8 space-y-6">
                    {/* Patient Summary and AI Diagnosis in horizontal layout */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Patient Summary */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl h-full">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Brain className="h-5 w-5 text-indigo-600" />
                              Patient Summary
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <p className="text-sm text-gray-600">Name</p>
                              <p className="font-semibold text-lg">{completedFormData?.patientName}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">Age</p>
                                <p className="font-semibold">{completedFormData?.age} years</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">BMI</p>
                                <p className="font-semibold">{completedFormData?.bmi}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">Height</p>
                                <p className="font-semibold">{completedFormData?.height} cm</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Weight</p>
                                <p className="font-semibold">{completedFormData?.weight} kg</p>
                              </div>
                            </div>
                            
                            {completedFormData?.symptoms && completedFormData.symptoms.length > 0 && (
                              <div>
                                <p className="text-sm text-gray-600 mb-2">Selected Symptoms</p>
                                <div className="flex flex-wrap gap-1">
                                  {completedFormData.symptoms.slice(0, 3).map((symptom, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {symptom}
                                    </Badge>
                                  ))}
                                  {completedFormData.symptoms.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{completedFormData.symptoms.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* AI Diagnosis */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl h-full">
                          <CardHeader>
                            <CardTitle className="text-green-700 font-bold">AI Diagnosis Results</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="text-center">
                              <Badge className={`text-lg px-4 py-2 ${getStageColor(result.prediction)}`}>
                                {result.prediction}
                              </Badge>
                              <p className="text-sm text-gray-600 mt-2">Classification: Class {result.class_index}</p>
                            </div>
                            
                            <div>
                              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                <span className="font-bold">Accuracy</span>
                                <span className="font-bold text-lg">{result.confidence_percent}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <motion.div
                                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: result.confidence_percent }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                />
                              </div>
                            </div>

                            {/* Uploaded Image Display */}
                            {uploadedImageUrl && (
                              <div className="text-center">
                                <p className="text-sm text-gray-600 mb-2">Analyzed MRI Scan</p>
                                <img 
                                  src={uploadedImageUrl} 
                                  alt="Analyzed MRI" 
                                  className="w-full max-h-32 object-contain rounded-lg shadow-md mx-auto"
                                />
                              </div>
                            )}

                            <FeedbackButton />
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>

                    {/* AI Recommendations - Full Width */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl">
                        <CardHeader>
                          <CardTitle className="text-purple-700 font-bold">AI Recommendations</CardTitle>
                          <CardDescription>
                            Comprehensive analysis and guidance
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 max-h-96 overflow-y-auto">
                            <div className="prose prose-sm max-w-none">
                              {formatAiAdvice(result.ai_advice)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  {/* Analytics & Feedback Form - Right Side */}
                  <div className="lg:col-span-4 space-y-6">
                    <FeedbackAnalytics />
                    <DetailedFeedbackForm />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Index;
