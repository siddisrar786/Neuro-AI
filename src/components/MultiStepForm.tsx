
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, User, Weight, Ruler, Brain, CheckCircle, Loader2, Plus, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ScanningAnimation from "./ScanningAnimation";

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

interface DiagnosisResult {
  prediction: string;
  class_index: number;
  confidence_percent: string;
  ai_advice: string;
}

interface MultiStepFormProps {
  onComplete: (result: DiagnosisResult, formData: FormData, uploadedImageUrl: string | null) => void;
}

const symptoms = [
  "Memory Loss",
  "Disorientation (Time/Place)",
  "Language Difficulties (Aphasia)",
  "Impaired Judgment",
  "Mood Changes",
  "Difficulty with Complex Tasks",
  "Behavioral Changes (e.g., agitation, apathy)",
  "Visual-Spatial Difficulties",
  "Motor Symptoms",
  "Executive Dysfunction",
  "NO symptom"
];

const loadingMessages = [
  "Initializing RegNet-150 model...",
  "Processing MRI scan data...",
  "Running TxGemma symptom analysis...",
  "Fusing multimodal predictions...",
  "Generating AI diagnosis report...",
  "Finalizing recommendations..."
];

const MultiStepForm = ({ onComplete }: MultiStepFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    file: null,
    patientName: "",
    age: "",
    height: "",
    weight: "",
    bmi: "",
    symptoms: [],
    manualSymptoms: ""
  });
  const { toast } = useToast();

  const calculateBMI = (height: string, weight: string) => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (h && w) {
      const bmi = w / ((h / 100) ** 2);
      return bmi.toFixed(2);
    }
    return "";
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === "height" || field === "weight") {
        updated.bmi = calculateBMI(updated.height, updated.weight);
      }
      return updated;
    });
  };

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      symptoms: checked 
        ? [...prev.symptoms, symptom]
        : prev.symptoms.filter(s => s !== symptom)
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setFormData(prev => ({ ...prev, file }));
        const imageUrl = URL.createObjectURL(file);
        setUploadedImageUrl(imageUrl);
        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been selected for analysis.`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (.jpg, .jpeg, .png)",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, file }));
      const imageUrl = URL.createObjectURL(file);
      setUploadedImageUrl(imageUrl);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been selected for analysis.`,
      });
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.file || !formData.patientName.trim()) {
        toast({
          title: "Missing Information",
          description: "Please provide patient name and upload an MRI image.",
          variant: "destructive",
        });
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.age || !formData.height || !formData.weight) {
        toast({
          title: "Missing Information",
          description: "Please fill in all patient measurements.",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setLoadingMessageIndex(0);

    // Cycle through loading messages
    const messageInterval = setInterval(() => {
      setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 500);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", formData.file!);
      formDataToSend.append("bmi", formData.bmi);
      
      const allSymptoms = [...formData.symptoms];
      if (formData.manualSymptoms.trim()) {
        allSymptoms.push(formData.manualSymptoms.trim());
      }
      
      allSymptoms.forEach(symptom => formDataToSend.append("symptoms", symptom));

      const response = await fetch("http://34.70.226.50:8000/predict", {
        method: "POST",
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Analysis failed");
      }

      clearInterval(messageInterval);
      setIsLoading(false);
      onComplete(data, formData, uploadedImageUrl);

    } catch (error) {
      clearInterval(messageInterval);
      setIsLoading(false);
      console.error("Prediction error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unable to process MRI scan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <motion.div 
              className="text-center mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Patient Information & MRI Upload</h3>
              <p className="text-gray-600">Let's start with basic information and your MRI scan</p>
            </motion.div>

            <div className="space-y-4">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Label htmlFor="patientName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Patient Name
                </Label>
                <Input
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) => handleInputChange("patientName", e.target.value)}
                  className="bg-white/50 backdrop-blur-sm transition-all duration-300 focus:bg-white/80 focus:scale-105"
                  placeholder="Enter patient name"
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Label>MRI Image Upload</Label>
                <motion.div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
                    dragActive 
                      ? 'border-indigo-500 bg-indigo-50/50' 
                      : 'border-gray-300 hover:border-indigo-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  {uploadedImageUrl ? (
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <img 
                        src={uploadedImageUrl} 
                        alt="Uploaded MRI" 
                        className="max-h-32 mx-auto rounded-lg shadow-md"
                      />
                      <p className="text-sm text-green-600 font-medium">
                        {formData.file?.name}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <motion.div
                        animate={{ 
                          y: [0, -10, 0],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      </motion.div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          Drag and drop your MRI image here
                        </p>
                        <p className="text-xs text-gray-500">or click to browse</p>
                      </div>
                    </motion.div>
                  )}
                  <input
                    type="file"
                    id="fileInput"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <motion.div 
              className="text-center mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Physical Measurements</h3>
              <p className="text-gray-600">Please provide the patient's physical measurements</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <Label htmlFor="age" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Age (years)
                </Label>
                <Input
                  id="age"
                  type="number"
                  min="0"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="bg-white/50 backdrop-blur-sm transition-all duration-300 focus:bg-white/80 focus:scale-105"
                  placeholder="Enter age"
                />
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <Label htmlFor="height" className="flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  min="50"
                  value={formData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  className="bg-white/50 backdrop-blur-sm transition-all duration-300 focus:bg-white/80 focus:scale-105"
                  placeholder="Enter height"
                />
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
              >
                <Label htmlFor="weight" className="flex items-center gap-2">
                  <Weight className="h-4 w-4" />
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  min="10"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  className="bg-white/50 backdrop-blur-sm transition-all duration-300 focus:bg-white/80 focus:scale-105"
                  placeholder="Enter weight"
                />
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <Label htmlFor="bmi">Calculated BMI</Label>
                <Input
                  id="bmi"
                  value={formData.bmi}
                  readOnly
                  className="bg-gray-50/50 backdrop-blur-sm font-semibold"
                  placeholder="Auto-calculated"
                />
              </motion.div>
            </div>

            {formData.bmi && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-blue-50/50 backdrop-blur-sm rounded-lg p-4 border border-blue-200"
              >
                <p className="text-sm text-blue-800">
                  <strong>BMI:</strong> {formData.bmi} - {
                    parseFloat(formData.bmi) < 18.5 ? "Underweight" :
                    parseFloat(formData.bmi) < 25 ? "Normal weight" :
                    parseFloat(formData.bmi) < 30 ? "Overweight" : "Obese"
                  }
                </p>
              </motion.div>
            )}
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <motion.div 
              className="text-center mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Symptoms Assessment</h3>
              <p className="text-gray-600">Select relevant symptoms or describe additional ones</p>
            </motion.div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {symptoms.map((symptom, index) => (
                  <motion.div
                    key={symptom}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-2 p-3 rounded-lg bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all duration-300 cursor-pointer border border-transparent hover:border-indigo-200"
                  >
                    <Checkbox
                      id={symptom}
                      checked={formData.symptoms.includes(symptom)}
                      onCheckedChange={(checked) => handleSymptomChange(symptom, checked as boolean)}
                    />
                    <Label htmlFor={symptom} className="text-sm cursor-pointer">
                      {symptom}
                    </Label>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.01 }}
              >
                <Label htmlFor="manualSymptoms" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Additional Symptoms (Optional)
                </Label>
                <Textarea
                  id="manualSymptoms"
                  value={formData.manualSymptoms}
                  onChange={(e) => handleInputChange("manualSymptoms", e.target.value)}
                  placeholder="Enter any additional symptoms not listed above..."
                  className="bg-white/50 backdrop-blur-sm min-h-[100px] transition-all duration-300 focus:bg-white/80"
                />
              </motion.div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            {isLoading ? (
              <div className="text-center space-y-6">
                <motion.h3 
                  className="text-2xl font-bold text-gray-800 mb-2"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Analyzing Your MRI Scan
                </motion.h3>
                <motion.p 
                  className="text-gray-600 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Our AI models are processing your data...
                </motion.p>
                
                {uploadedImageUrl && (
                  <ScanningAnimation imageUrl={uploadedImageUrl} />
                )}
                
                <motion.div 
                  className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    key={loadingMessageIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-center gap-3"
                  >
                    <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                    <span className="text-gray-700 font-medium">
                      {loadingMessages[loadingMessageIndex]}
                    </span>
                  </motion.div>
                </motion.div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <motion.h3 
                  className="text-2xl font-bold text-gray-800 mb-2"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Ready for Analysis
                </motion.h3>
                <motion.p 
                  className="text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  Review your information and start the AI diagnosis
                </motion.p>
                
                <motion.div 
                  className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200 text-left space-y-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h4 className="font-semibold text-gray-800">Patient Information</h4>
                    <p className="text-gray-600">Name: {formData.patientName}</p>
                    <p className="text-gray-600">Age: {formData.age} years, BMI: {formData.bmi}</p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h4 className="font-semibold text-gray-800">Selected Symptoms</h4>
                    <p className="text-gray-600">
                      {formData.symptoms.length > 0 ? formData.symptoms.join(", ") : "No symptoms selected"}
                    </p>
                  </motion.div>
                  
                  {formData.manualSymptoms && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h4 className="font-semibold text-gray-800">Additional Symptoms</h4>
                      <p className="text-gray-600">{formData.manualSymptoms}</p>
                    </motion.div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button 
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg transform transition-all duration-300 hover:scale-105"
                    size="lg"
                  >
                    <Brain className="mr-2 h-5 w-5" />
                    Get AI Diagnosis
                  </Button>
                </motion.div>
              </div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              AI Diagnosis - Step {currentStep} of 4
            </CardTitle>
            <CardDescription>
              Complete each step to get your comprehensive AI analysis
            </CardDescription>
          </motion.div>
          
          {/* Progress Bar */}
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {[1, 2, 3, 4].map((step) => (
              <motion.div
                key={step}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  step <= currentStep ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: step * 0.1 }}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </motion.div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
        
        {!isLoading && (
          <motion.div 
            className="flex justify-between pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 transition-all duration-300"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            </motion.div>
            
            {currentStep < 4 && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleNextStep}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-all duration-300"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default MultiStepForm;
