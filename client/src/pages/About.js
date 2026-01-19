import React from 'react';
import { Brain, Lightbulb, Target, RefreshCw, BookOpen, Users, Zap } from 'lucide-react';

const About = () => {
  const feynmanSteps = [
    {
      number: 1,
      title: "Choose a Concept",
      description: "Pick any topic you want to understand better. It could be anything from quantum physics to cooking techniques.",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      number: 2,
      title: "Teach It to a Child",
      description: "Explain the concept in simple terms, as if teaching it to a 12-year-old. Use plain language and avoid jargon.",
      icon: Lightbulb,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      number: 3,
      title: "Identify Knowledge Gaps",
      description: "Notice where you struggle to explain clearly. These gaps reveal what you don't fully understand yet.",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      number: 4,
      title: "Review and Simplify",
      description: "Go back to your sources, fill in the gaps, and simplify your explanation even further.",
      icon: RefreshCw,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const benefits = [
    {
      icon: Brain,
      title: "Deep Understanding",
      description: "Move beyond memorization to true comprehension of complex topics"
    },
    {
      icon: Zap,
      title: "Better Retention",
      description: "Information learned through explanation sticks in your memory longer"
    },
    {
      icon: Users,
      title: "Clear Communication",
      description: "Learn to explain complex ideas in ways others can easily understand"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          About the <span className="text-gradient">Feynman Technique</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Named after Nobel Prize-winning physicist Richard Feynman, this learning method 
          helps you master any subject by teaching it in simple terms.
        </p>
      </div>

      {/* What is the Feynman Technique */}
      <div className="py-16">
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What is the Feynman Technique?
            </h2>
            <p className="text-lg text-gray-600">
              A powerful learning method that transforms complex topics into simple, understandable concepts
            </p>
          </div>
          
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            <p className="text-lg mb-6">
              The Feynman Technique is a learning method developed by Richard Feynman, 
              a Nobel Prize-winning physicist known for his ability to explain complex 
              scientific concepts in simple, accessible terms.
            </p>
            
            <p className="mb-6">
              The technique is based on the principle that if you can't explain something 
              simply, you don't understand it well enough. By forcing yourself to teach 
              a concept in plain language, you identify gaps in your knowledge and 
              develop a deeper, more intuitive understanding.
            </p>
            
            <p>
              This method is particularly effective because it engages multiple cognitive 
              processes: comprehension, synthesis, and communication. When you explain 
              something to others (or even to yourself), you're not just recalling 
              information—you're actively constructing understanding.
            </p>
          </div>
        </div>
      </div>

      {/* The Four Steps */}
      <div className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          The Four Steps of the Feynman Technique
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {feynmanSteps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div key={step.number} className="card">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${step.bgColor} dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className={`h-6 w-6 ${step.color} dark:text-cyan-300`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-2xl font-bold text-gray-400 dark:text-slate-300">0{step.number}</span>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-slate-200 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefits */}
      <div className="py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why the Feynman Technique Works
          </h2>
          <p className="text-lg text-gray-600">
            Scientific research supports the effectiveness of this learning method
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit) => {
            const IconComponent = benefit.icon;
            return (
              <div key={benefit.title} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <IconComponent className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How Our App Helps */}
      <div className="py-16">
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">
              How Our App Enhances the Feynman Technique
            </h2>
            <p className="text-lg text-gray-600 dark:text-slate-200">
              AI-powered guidance to make your learning more effective
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-emerald-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-emerald-200 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">
                      AI-Generated Simple Explanations
                    </h3>
                    <p className="text-gray-600 dark:text-slate-200">
                      Get clear, beginner-friendly explanations to start your learning journey
                    </p>
                  </div>
                </div>
              
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-sky-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 dark:text-sky-200 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">
                      Intelligent Gap Detection
                    </h3>
                    <p className="text-gray-600 dark:text-slate-200">
                      Our AI identifies exactly where your understanding needs improvement
                    </p>
                  </div>
                </div>
              
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-violet-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 dark:text-violet-200 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">
                      Personalized Practice Questions
                    </h3>
                    <p className="text-gray-600 dark:text-slate-200">
                      Test your understanding with questions tailored to your learning level
                    </p>
                  </div>
                </div>
            </div>
            
            <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-amber-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 dark:text-amber-200 font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">
                      Explanation Refinement
                    </h3>
                    <p className="text-gray-600 dark:text-slate-200">
                      Get suggestions to make your explanations clearer and more accessible
                    </p>
                  </div>
                </div>
              
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 dark:bg-rose-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 dark:text-rose-200 font-bold">5</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">
                      Guided Learning Process
                    </h3>
                    <p className="text-gray-600 dark:text-slate-200">
                      Step-by-step guidance through the entire Feynman Technique process
                    </p>
                  </div>
                </div>
              
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-600 dark:text-indigo-200 font-bold">6</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">
                      Progress Tracking
                    </h3>
                    <p className="text-gray-600 dark:text-slate-200">
                      Visual progress indicators to keep you motivated and on track
                    </p>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Master Any Topic?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Start your learning journey with the Feynman Technique today
        </p>
        <a
          href="/learn"
          className="inline-flex items-center space-x-2 btn-primary text-lg px-8 py-3"
        >
          <Brain className="h-5 w-5" />
          <span>Start Learning</span>
        </a>
      </div>
    </div>
  );
};

export default About;
