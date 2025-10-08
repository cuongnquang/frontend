'use client';

import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

/**
 * Props for the StepNavigation component.
 */
interface StepNavigationProps {
  currentStep: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isNextDisabled: boolean;
  totalSteps?: number; // Optional, defaults to 4
}

/**
 * Navigation component for the multi-step appointment form.
 * Provides Back, Next, and Submit buttons.
 */
export default function StepNavigation({ 
    currentStep, 
    onBack, 
    onNext, 
    onSubmit, 
    isNextDisabled,
    totalSteps = 4
}: StepNavigationProps): React.ReactElement {
  return (
    <div className="container mx-auto px-4 max-w-4xl">
    <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6">
      <div>
        {currentStep > 2 && (
          <button
            onClick={onBack}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 flex items-center transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </button>
        )}
      </div>

      <div>
        {currentStep < totalSteps ? (
          <button
            onClick={onNext}
            disabled={isNextDisabled}
            className={`px-6 py-3 rounded-lg flex items-center transition-colors duration-200 text-white ${
              isNextDisabled
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Tiếp theo
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={isNextDisabled} // Also disable submit if final step is invalid
            className={`px-6 py-3 rounded-lg flex items-center transition-colors duration-200 text-white ${
                isNextDisabled
                  ? 'bg-green-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
          >
            Xác nhận Đặt lịch
            <CheckCircle className="w-5 h-5 ml-2" />
          </button>
        )}
      </div>
    </div>
    </div>
  );
}
