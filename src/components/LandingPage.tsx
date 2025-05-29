import { motion } from "framer-motion";
import { Brain, Shield, Zap, Users, ExternalLink, Upload, Activity, FileText, Database, CheckCircle, Star, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import VisitorTracker from "./VisitorTracker";
import FeedbackAnalytics from "./FeedbackAnalytics";
interface LandingPageProps {
  onGetStarted: () => void;
}
const LandingPage = ({
  onGetStarted
}: LandingPageProps) => {
  const openColabNotebook = () => {
    window.open('https://colab.research.google.com/drive/1VZsKF97n77H1h4VPAOBFV_j2kVTZ499X?usp=sharing', '_blank');
  };
  const roadmapSteps = [{
    icon: Upload,
    title: "MRI Image Upload",
    description: "Upload T1-weighted axial brain MRI scans",
    color: "text-blue-600"
  }, {
    icon: Brain,
    title: "RegNet-150 Processing",
    description: "AI-powered image analysis with 99.56% accuracy",
    color: "text-indigo-600"
  }, {
    icon: Activity,
    title: "TxGemma Symptom Analysis",
    description: "Parallel symptom assessment using TxGemma",
    color: "text-purple-600"
  }, {
    icon: Zap,
    title: "Multimodal Fusion",
    description: "Combining image and text analysis",
    color: "text-orange-600"
  }, {
    icon: FileText,
    title: "AI Diagnosis Report",
    description: "Comprehensive diagnostic report generation",
    color: "text-green-600"
  }];
  const datasetStats = [{
    value: "8,192",
    label: "Training Images"
  }, {
    value: "2,048",
    label: "Validation Images"
  }, {
    value: "1,279",
    label: "Testing Images"
  }];
  const acknowledgments = [
    {
      name: "Isarar Siddique",
      role: "Biotech Engineer & Project lead",
      contribution: "Final year student btech biotechnology of GITM Lucknow",
      email: "isararsiddique@gmail.com",
      linkedin: "https://www.linkedin.com/in/isarar"
    },
    {
      name: "Raiyan Siddique",
      role: "CTO, Biotech Wallah Pvt Ltd",
      contribution: "Platform development and technical architecture"
    },
    {
      name: "Prof. Margaret Windy",
      role: "Stanford University, Neuroscientist",
      contribution: "Concept validation and external guidance"
    },
    {
      name: "Dr. Prashant Katiyar",
      role: "HOD Biotechnology, Goel Institute of Technology",
      contribution: "Internal guidance and project coordination"
    },
    {
      name: "Ms. Kanchan Bhatt",
      role: "Project Coordinator",
      contribution: "Incredible support throughout the project"
    }
  ];
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header with Visitor Tracker */}
      <motion.header initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <Brain className="h-10 w-10 text-indigo-600" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Neuro AI
          </h1>
        </div>
        <VisitorTracker />
      </motion.header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Neuro AI Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Advanced AI-powered neurological analysis for early detection of Alzheimer's disease. 
            Cutting-edge machine learning technology for medical professionals and researchers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button onClick={onGetStarted} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg" size="lg">
              <Brain className="mr-2 h-5 w-5" />
              Start AI Analysis
            </Button>
            
            <Button onClick={openColabNotebook} variant="outline" className="px-8 py-4 text-lg border-2 border-orange-500 text-orange-600 hover:bg-orange-50" size="lg">
              <ExternalLink className="mr-2 h-5 w-5" />
              View Training Steps
            </Button>
          </div>

          {/* Disclaimer */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.3
        }} className="bg-gradient-to-r from-yellow-50/80 to-orange-50/80 backdrop-blur-sm border border-yellow-200/50 rounded-lg p-4 max-w-4xl mx-auto">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Important Disclaimer:</strong> This platform is currently in trial phase and is not medically proven. 
              Do not use for main diagnosis stream or rely on this platform until fully validated. For educational and verification purposes only.
            </p>
          </motion.div>
        </motion.div>

        {/* How Our AI Works Section */}
        <motion.section initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.4
      }} className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">How Our AI Works</h2>
            <p className="text-lg text-gray-600">Follow the interactive roadmap to understand our multimodal AI approach</p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-6">
            {roadmapSteps.map((step, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.5 + index * 0.1
          }} className="relative">
                <Card className="text-center p-6 bg-white/70 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-4">
                    <step.icon className={`h-12 w-12 ${step.color} mx-auto mb-4`} />
                    <h3 className="font-semibold mb-2 text-gray-800">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
                {index < roadmapSteps.length - 1 && <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400"></div>}
              </motion.div>)}
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.6
      }} className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg">
            <Brain className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
            <p className="text-gray-600">Advanced machine learning algorithms trained on extensive neurological datasets</p>
          </div>
          
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg">
            <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600">HIPAA-compliant data handling with enterprise-grade security measures</p>
          </div>
          
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg">
            <Zap className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Fast Results</h3>
            <p className="text-gray-600">Get comprehensive analysis reports in minutes, not hours</p>
          </div>
        </motion.div>

        {/* Dataset & Training Section */}
        <motion.section initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.7
      }} className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Dataset & Training</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Our RegNet-150 model was trained on a comprehensive Kaggle dataset containing 11,520 T1-weighted axial brain MRI scans.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {datasetStats.map((stat, index) => <motion.div key={index} initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            delay: 0.8 + index * 0.1
          }} className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg">
                <div className="text-4xl font-bold text-indigo-600 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>)}
          </div>
        </motion.section>

        {/* Analytics Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.8
      }} className="max-w-2xl mx-auto mb-20">
          <FeedbackAnalytics />
        </motion.div>

        {/* Important Disclaimer Section */}
        <motion.section initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.9
      }} className="mb-20">
          <Card className="bg-gradient-to-r from-red-50/80 to-orange-50/80 backdrop-blur-sm border border-red-200/50 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-red-800 flex items-center justify-center gap-2">
                <Shield className="h-6 w-6" />
                Important Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-red-700 text-lg leading-relaxed">
                ⚠️ This platform is currently in trial phase and is not medically proven. Do not use for main diagnosis stream or rely on this platform until fully validated. This tool is designed for educational, research, and verification purposes only for students, professionals, researchers, and doctors.
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Acknowledgments Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Acknowledgments</h2>
            <p className="text-lg text-gray-600">
              We thank the following individuals for their invaluable contributions to this project
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {acknowledgments.map((person, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
              >
                <Card className="p-6 bg-white/70 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {person.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800">{person.name}</h3>
                        <p className="text-indigo-600 font-medium mb-2">{person.role}</p>
                        <p className="text-gray-600 mb-3">{person.contribution}</p>
                        {person.email && person.linkedin && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`mailto:${person.email}`, '_blank')}
                              className="flex items-center gap-1 text-xs"
                            >
                              <Mail className="h-3 w-3" />
                              Email
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(person.linkedin, '_blank')}
                              className="flex items-center gap-1 text-xs"
                            >
                              <Linkedin className="h-3 w-3" />
                              LinkedIn
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 1.2
      }} className="text-center mb-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Trusted by Medical Professionals</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="p-4">
              <div className="text-3xl font-bold text-indigo-600 mb-2">99.56%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-purple-600 mb-2">100+</div>
              <div className="text-gray-600">Scans Analyzed</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-green-600 mb-2">200ms</div>
              <div className="text-gray-600">Avg. Latency</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Availability</div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA Section */}
        <motion.section initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 1.3
      }} className="text-center">
          <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 shadow-2xl">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold mb-4">Ready to Experience AI-Powered Diagnosis?</h2>
              <p className="text-xl mb-8 text-indigo-100">
                Join researchers and professionals using our advanced neurological AI platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={onGetStarted} className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold" size="lg">
                  <Brain className="mr-2 h-5 w-5" />
                  Start Your Analysis
                </Button>
                <Button onClick={openColabNotebook} variant="outline" size="lg" className="border-white hover:bg-white/10 px-8 py-4 text-lg text-gray-950">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  View Training Process
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>;
};
export default LandingPage;
