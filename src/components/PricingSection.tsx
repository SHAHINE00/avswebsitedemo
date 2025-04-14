
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const pricingPlans = [
  {
    name: "Basic",
    price: "$499",
    description: "Perfect for beginners looking to explore AI fundamentals",
    features: [
      "6-month course access",
      "Core curriculum modules",
      "Community forum access",
      "Monthly Q&A sessions",
      "Digital certificate"
    ],
    buttonText: "Get Started",
    isPopular: false
  },
  {
    name: "Professional",
    price: "$999",
    description: "Our most popular plan for serious career advancement",
    features: [
      "Lifetime course access",
      "All curriculum modules",
      "1-on-1 mentoring sessions",
      "Priority support",
      "Project reviews & feedback",
      "Job placement assistance",
      "Industry-recognized certification"
    ],
    buttonText: "Enroll Now",
    isPopular: true
  },
  {
    name: "Enterprise",
    price: "Contact Us",
    description: "Custom training solutions for organizations and teams",
    features: [
      "Custom curriculum",
      "Dedicated instructor",
      "Team collaboration tools",
      "Progress tracking",
      "White-labeled platform",
      "Corporate reporting",
      "Bulk enrollment discounts"
    ],
    buttonText: "Request Quote",
    isPopular: false
  }
];

const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-20 bg-academy-gray">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Flexible Pricing Plans</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Choose the plan that best fits your learning goals and budget.
            All plans include core AI training materials and exercises.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-lg shadow-md overflow-hidden relative ${
                plan.isPopular ? 'border-2 border-academy-blue ring-4 ring-academy-blue/20' : ''
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-academy-blue text-white py-1 px-4 font-medium text-sm transform translate-x-6 rotate-45 origin-bottom-left">
                    Popular
                  </div>
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Contact Us" && <span className="text-gray-600"> / one-time</span>}
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-academy-purple shrink-0 mr-2 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full py-6 text-lg ${
                    plan.isPopular 
                      ? 'bg-academy-blue hover:bg-academy-purple' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Need help choosing the right plan? <a href="#" className="text-academy-blue font-medium hover:underline">Contact our advisors</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
