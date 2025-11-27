import React, { useState, useCallback, useMemo } from 'react';
import { clsx } from 'clsx';
import { Button } from '../Button/Button';

export interface FormStep {
  /**
   * Unique identifier for the step
   */
  id: string;
  /**
   * Step title
   */
  title: string;
  /**
   * Step description/subtitle
   */
  description?: string;
  /**
   * Step content/fields
   */
  content: React.ReactNode;
  /**
   * Optional icon for the step
   */
  icon?: React.ReactNode;
  /**
   * Whether step is optional
   */
  optional?: boolean;
  /**
   * Custom validation function for the step
   */
  validate?: () => boolean | Promise<boolean>;
  /**
   * Custom className for step content
   */
  className?: string;
}

export interface MultiStepFormProps {
  /**
   * Array of form steps
   */
  steps: FormStep[];
  /**
   * Current active step (controlled)
   */
  currentStep?: number;
  /**
   * Default step to start from
   */
  defaultStep?: number;
  /**
   * Callback when step changes
   */
  onStepChange?: (stepIndex: number) => void;
  /**
   * Callback when form is submitted
   */
  onSubmit?: (formData: Record<string, any>) => void;
  /**
   * Callback when form is cancelled
   */
  onCancel?: () => void;
  /**
   * Orientation of step indicator
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Variant style
   */
  variant?: 'default' | 'numbered' | 'dots' | 'tabs';
  /**
   * Size variant
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Whether to show step numbers
   */
  showStepNumbers?: boolean;
  /**
   * Whether to show progress bar
   */
  showProgress?: boolean;
  /**
   * Whether to allow navigation to previous steps
   */
  allowBackNavigation?: boolean;
  /**
   * Whether to allow skipping steps
   */
  allowSkip?: boolean;
  /**
   * Whether to validate before moving to next step
   */
  validateOnNext?: boolean;
  /**
   * Custom next button text
   */
  nextButtonText?: string;
  /**
   * Custom previous button text
   */
  previousButtonText?: string;
  /**
   * Custom submit button text
   */
  submitButtonText?: string;
  /**
   * Custom cancel button text
   */
  cancelButtonText?: string;
  /**
   * Whether to show cancel button
   */
  showCancelButton?: boolean;
  /**
   * Button placement
   */
  buttonPlacement?: 'left' | 'center' | 'right' | 'space-between';
  /**
   * Custom className
   */
  className?: string;
  /**
   * Custom className for step indicator
   */
  indicatorClassName?: string;
  /**
   * Custom className for step content
   */
  contentClassName?: string;
  /**
   * Custom className for buttons container
   */
  buttonsClassName?: string;
  /**
   * Loading state
   */
  isLoading?: boolean;
  /**
   * Whether form is disabled
   */
  disabled?: boolean;
}

/**
 * Multi-Step Form Component
 */
export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  steps,
  currentStep: controlledCurrentStep,
  defaultStep = 0,
  onStepChange,
  onSubmit,
  onCancel,
  orientation = 'horizontal',
  variant = 'default',
  size = 'medium',
  showStepNumbers = true,
  showProgress = true,
  allowBackNavigation = true,
  allowSkip = false,
  validateOnNext = false,
  nextButtonText = 'Next',
  previousButtonText = 'Previous',
  submitButtonText = 'Submit',
  cancelButtonText = 'Cancel',
  showCancelButton = false,
  buttonPlacement = 'right',
  className,
  indicatorClassName,
  contentClassName,
  buttonsClassName,
  isLoading = false,
  disabled = false,
}) => {
  const [internalStep, setInternalStep] = useState(defaultStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState<Record<number, string>>({});

  const isControlled = controlledCurrentStep !== undefined;
  const currentStep = isControlled ? controlledCurrentStep : internalStep;

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Size classes
  const sizeClasses = {
    small: {
      step: 'text-sm',
      title: 'text-base font-semibold',
      description: 'text-xs',
      content: 'text-sm',
      button: 'small' as const,
    },
    medium: {
      step: 'text-base',
      title: 'text-lg font-semibold',
      description: 'text-sm',
      content: 'text-base',
      button: 'medium' as const,
    },
    large: {
      step: 'text-lg',
      title: 'text-xl font-semibold',
      description: 'text-base',
      content: 'text-lg',
      button: 'large' as const,
    },
  };

  const sizes = sizeClasses[size];

  // Handle step change
  const handleStepChange = useCallback(
    async (newStep: number) => {
      if (disabled || isLoading) return;

      // Validate current step if validation is enabled
      if (validateOnNext && newStep > currentStep) {
        const step = steps[currentStep];
        if (step.validate) {
          try {
            const isValid = await step.validate();
            if (!isValid) {
              setErrors((prev) => ({
                ...prev,
                [currentStep]: 'Please complete this step before continuing',
              }));
              return;
            }
          } catch (error) {
            setErrors((prev) => ({
              ...prev,
              [currentStep]: 'Validation failed',
            }));
            return;
          }
        }
      }

      // Clear error for current step
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[currentStep];
        return newErrors;
      });

      // Mark current step as completed
      if (newStep > currentStep) {
        setCompletedSteps((prev) => new Set([...prev, currentStep]));
      }

      if (isControlled) {
        onStepChange?.(newStep);
      } else {
        setInternalStep(newStep);
        onStepChange?.(newStep);
      }
    },
    [currentStep, disabled, isLoading, isControlled, onStepChange, steps, validateOnNext]
  );

  // Handle next
  const handleNext = useCallback(() => {
    if (!isLastStep) {
      handleStepChange(currentStep + 1);
    }
  }, [currentStep, handleStepChange, isLastStep]);

  // Handle previous
  const handlePrevious = useCallback(() => {
    if (!isFirstStep && allowBackNavigation) {
      handleStepChange(currentStep - 1);
    }
  }, [allowBackNavigation, currentStep, handleStepChange, isFirstStep]);

  // Handle submit
  const handleSubmit = useCallback(async () => {
    if (disabled || isLoading) return;

    // Validate last step
    const lastStep = steps[totalSteps - 1];
    if (validateOnNext && lastStep.validate) {
      try {
        const isValid = await lastStep.validate();
        if (!isValid) {
          setErrors((prev) => ({
            ...prev,
            [totalSteps - 1]: 'Please complete this step before submitting',
          }));
          return;
        }
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          [totalSteps - 1]: 'Validation failed',
        }));
        return;
      }
    }

    // Mark last step as completed
    setCompletedSteps((prev) => new Set([...prev, totalSteps - 1]));

    // Collect form data (simplified - in real app, you'd collect from form fields)
    const formData: Record<string, any> = {};
    onSubmit?.(formData);
  }, [disabled, isLoading, onSubmit, steps, totalSteps, validateOnNext]);

  // Handle step click (for navigation)
  const handleStepClick = useCallback(
    (stepIndex: number) => {
      if (disabled || isLoading) return;
      if (!allowBackNavigation && stepIndex > currentStep) return;
      if (stepIndex === currentStep) return;

      handleStepChange(stepIndex);
    },
    [allowBackNavigation, currentStep, disabled, handleStepChange, isLoading]
  );

  // Button placement classes
  const buttonPlacementClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    'space-between': 'justify-between',
  };

  // Render step indicator
  const renderStepIndicator = () => {
    if (variant === 'dots') {
      return (
        <div className={clsx('flex items-center gap-2', orientation === 'vertical' && 'flex-col', indicatorClassName)}>
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = completedSteps.has(index);
            const isClickable = allowBackNavigation || index <= currentStep;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => handleStepClick(index)}
                disabled={disabled || !isClickable}
                className={clsx(
                  'rounded-full transition-all duration-200',
                  isActive
                    ? 'w-3 h-3 bg-blue-600 dark:bg-blue-500 ring-4 ring-blue-200 dark:ring-blue-900'
                    : isCompleted
                    ? 'w-3 h-3 bg-green-500 dark:bg-green-400'
                    : 'w-2 h-2 bg-gray-300 dark:bg-gray-600',
                  isClickable && !disabled && 'hover:scale-110 cursor-pointer',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
                title={step.title}
              />
            );
          })}
        </div>
      );
    }

    if (variant === 'tabs') {
      return (
        <div className={clsx('border-b border-gray-200 dark:border-gray-700', indicatorClassName)}>
          <div className={clsx('flex', orientation === 'vertical' && 'flex-col')}>
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = completedSteps.has(index);
              const isClickable = allowBackNavigation || index <= currentStep;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => handleStepClick(index)}
                  disabled={disabled || !isClickable}
                  className={clsx(
                    'px-4 py-3 border-b-2 transition-colors duration-200',
                    sizes.step,
                    isActive
                      ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-semibold'
                      : isCompleted
                      ? 'border-green-500 dark:border-green-400 text-gray-700 dark:text-gray-300'
                      : 'border-transparent text-gray-500 dark:text-gray-400',
                    isClickable && !disabled && 'hover:text-gray-900 dark:hover:text-gray-100',
                    disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {step.title}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // Default and numbered variants
    return (
      <div
        className={clsx(
          'flex',
          orientation === 'horizontal' ? 'flex-row items-start' : 'flex-col',
          indicatorClassName
        )}
      >
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = completedSteps.has(index);
          const isClickable = allowBackNavigation || index <= currentStep;
          const hasError = errors[index];

          return (
            <div
              key={step.id}
              className={clsx(
                'flex items-start',
                orientation === 'horizontal'
                  ? index === 0
                    ? 'justify-start'
                    : index === totalSteps - 1
                    ? 'justify-end flex-1'
                    : 'flex-1'
                  : 'w-full mb-6'
              )}
            >
              {/* Step circle/number */}
              <div className={clsx('flex flex-col items-center', orientation === 'horizontal' && 'flex-shrink-0')}>
                <button
                  type="button"
                  onClick={() => handleStepClick(index)}
                  disabled={disabled || !isClickable}
                  className={clsx(
                    'flex items-center justify-center rounded-full transition-all duration-200 font-semibold',
                    sizes.step,
                    isActive
                      ? 'bg-blue-600 dark:bg-blue-500 text-white ring-4 ring-blue-200 dark:ring-blue-900'
                      : isCompleted
                      ? 'bg-green-500 dark:bg-green-400 text-white'
                      : hasError
                      ? 'bg-red-500 dark:bg-red-400 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
                    variant === 'numbered' || showStepNumbers
                      ? 'w-10 h-10'
                      : 'w-8 h-8',
                    isClickable && !disabled && 'hover:scale-110 cursor-pointer',
                    disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {isCompleted && !isActive ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : variant === 'numbered' || showStepNumbers ? (
                    index + 1
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-current" />
                  )}
                </button>

                {/* Step info (vertical only or when expanded) */}
                {(orientation === 'vertical' || variant === 'tabs') && (
                  <div className={clsx('mt-2 text-center', orientation === 'vertical' && 'w-full')}>
                    <div
                      className={clsx(
                        sizes.title,
                        isActive
                          ? 'text-gray-900 dark:text-gray-100'
                          : isCompleted
                          ? 'text-gray-700 dark:text-gray-300'
                          : 'text-gray-500 dark:text-gray-400'
                      )}
                    >
                      {step.title}
                    </div>
                    {step.description && (
                      <div className={clsx(sizes.description, 'text-gray-500 dark:text-gray-400 mt-1')}>
                        {step.description}
                      </div>
                    )}
                    {step.optional && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">(Optional)</span>
                    )}
                  </div>
                )}
              </div>

              {/* Step connector (horizontal only) - after step circle */}
              {orientation === 'horizontal' && index < totalSteps - 1 && (
                <div
                  className={clsx(
                    'flex-1 h-0.5 mt-4 mx-2 transition-colors duration-200',
                    isCompleted ? 'bg-green-500 dark:bg-green-400' : 'bg-gray-300 dark:bg-gray-600'
                  )}
                />
              )}

              {/* Step connector (vertical only) */}
              {orientation === 'vertical' && index < totalSteps - 1 && (
                <div
                  className={clsx(
                    'w-0.5 flex-1 mx-auto transition-colors duration-200',
                    isCompleted ? 'bg-green-500 dark:bg-green-400' : 'bg-gray-300 dark:bg-gray-600'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={clsx('multi-step-form', className)}>
      {/* Progress bar */}
      {showProgress && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Step indicator */}
      <div className={clsx('mb-8', orientation === 'vertical' && 'flex')}>
        {renderStepIndicator()}
      </div>

      {/* Step content */}
      <div className={clsx('step-content', contentClassName)}>
        {errors[currentStep] && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
            {errors[currentStep]}
          </div>
        )}

        <div className={clsx(sizes.content, steps[currentStep]?.className)}>
          {steps[currentStep]?.content}
        </div>
      </div>

      {/* Navigation buttons */}
      <div
        className={clsx(
          'flex items-center gap-3 mt-8',
          buttonPlacementClasses[buttonPlacement],
          buttonsClassName
        )}
      >
        {showCancelButton && (
          <Button
            variant="secondary"
            size={sizes.button}
            onClick={onCancel}
            disabled={disabled || isLoading}
          >
            {cancelButtonText}
          </Button>
        )}

        {!isFirstStep && allowBackNavigation && (
          <Button
            variant="secondary"
            size={sizes.button}
            onClick={handlePrevious}
            disabled={disabled || isLoading}
          >
            {previousButtonText}
          </Button>
        )}

        {allowSkip && !isLastStep && (
          <Button
            variant="secondary"
            size={sizes.button}
            onClick={handleNext}
            disabled={disabled || isLoading}
            outlined
          >
            Skip
          </Button>
        )}

        {!isLastStep ? (
          <Button
            variant="primary"
            size={sizes.button}
            onClick={handleNext}
            disabled={disabled || isLoading}
            isLoading={isLoading}
          >
            {nextButtonText}
          </Button>
        ) : (
          <Button
            variant="primary"
            size={sizes.button}
            onClick={handleSubmit}
            disabled={disabled || isLoading}
            isLoading={isLoading}
          >
            {submitButtonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;

