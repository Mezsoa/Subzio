"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Zap, 
  Shield, 
  TrendingUp,
  Bell,
  Target
} from 'lucide-react';
import ConnectBank from '@/components/ConnectBank';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

interface OnboardingFlowProps {
  onComplete?: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps = {}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [userPreferences, setUserPreferences] = useState({
    emailNotifications: true,
    smsNotifications: true,
    savingsGoal: 100,
    weeklyReports: true,
  });
  const router = useRouter();

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to KillSub!',
      description: 'Your AI-powered subscription manager that helps you save money',
      icon: <Zap className="w-8 h-8 text-primary" />,
      component: <WelcomeStep />
    },
    {
      id: 'connect',
      title: 'Connect Your Bank',
      description: 'Securely connect your bank account to start detecting subscriptions',
      icon: <Shield className="w-8 h-8 text-primary" />,
      component: <ConnectBankStep />
    },
    {
      id: 'preferences',
      title: 'Set Your Preferences',
      description: 'Customize your experience and savings goals',
      icon: <Target className="w-8 h-8 text-primary" />,
      component: <PreferencesStep 
        preferences={userPreferences}
        setPreferences={setUserPreferences}
      />
    },
    {
      id: 'notifications',
      title: 'Stay Informed',
      description: 'Choose how you want to be notified about your subscriptions',
      icon: <Bell className="w-8 h-8 text-primary" />,
      component: <NotificationsStep 
        preferences={userPreferences}
        setPreferences={setUserPreferences}
      />
    },
    {
      id: 'complete',
      title: 'You&apos;re All Set!',
      description: 'Start saving money with KillSub',
      icon: <Check className="w-8 h-8 text-green-500" />,
      component: <CompleteStep />
    }
  ];

  const handleNext = () => {
    const currentStepId = steps[currentStep].id;
    if (!completedSteps.includes(currentStepId)) {
      setCompletedSteps([...completedSteps, currentStepId]);
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Save user preferences
      await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          onboarding_completed: true,
          preferences: userPreferences,
        }),
      });
      
      // Mark onboarding as completed
      localStorage.setItem('onboarding_completed', 'true');
      
      // Call the onComplete callback if provided, otherwise redirect
      if (onComplete) {
        onComplete();
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      if (onComplete) {
        onComplete();
      } else {
        router.push('/dashboard');
      }
    }
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background-light flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1">
        <div 
          className="bg-gradient-to-r from-cta-start to-cta-end h-1 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border-light">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-cta-end rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground-black">KillSub</span>
        </div>
        
        <div className="text-sm text-muted-light">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          
          {/* Step Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              {currentStepData.icon}
            </div>
            <h1 className="text-3xl font-bold text-foreground-black mb-2">
              {currentStepData.title}
            </h1>
            <p className="text-lg text-muted-light">
              {currentStepData.description}
            </p>
          </div>

          {/* Step Content */}
          <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-8 shadow-sm">
            {currentStepData.component}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-6 py-3 border border-border-light rounded-lg text-muted-light hover:text-foreground-black hover:border-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cta-start to-cta-end text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                <span>Get Started</span>
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Components
function WelcomeStep() {
  return (
    <div className="text-center space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground-black mb-2">Save Money</h3>
          <p className="text-sm text-muted-light">Find and cancel unwanted subscriptions automatically</p>
        </div>
        
        <div className="p-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground-black mb-2">Stay Secure</h3>
          <p className="text-sm text-muted-light">Bank-grade security with encrypted connections</p>
        </div>
        
        <div className="p-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground-black mb-2">AI-Powered</h3>
          <p className="text-sm text-muted-light">Smart detection of recurring charges and subscriptions</p>
        </div>
      </div>
      
      <p className="text-muted-light">
        Let&apos;s get you set up in just a few quick steps. This will take less than 3 minutes.
      </p>
    </div>
  );
}

function ConnectBankStep() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <Shield className="w-16 h-16 text-primary mx-auto" />
        <div>
          <h3 className="text-lg font-semibold text-foreground-black mb-2">
            Your Security is Our Priority
          </h3>
          <p className="text-muted-light">
            We use Plaid and BankID - the same secure technology trusted by thousands of financial apps.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm max-w-md mx-auto">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-foreground-black">256-bit encryption</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-foreground-black">Read-only access</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-foreground-black">No credentials stored</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-foreground-black">Disconnect anytime</span>
          </div>
        </div>
      </div>

      {/* Actual Connect Bank Component */}
      <div className="bg-background-light-mid/30 rounded-xl p-6 border border-border-light">
        <div className="text-center mb-4">
          <h4 className="font-medium text-foreground-black mb-2">Connect Your Bank Account</h4>
          <p className="text-sm text-muted-light">Choose your preferred connection method:</p>
        </div>
        <div className="flex justify-start">
          <ConnectBank />
        </div>
      </div>
      
      <p className="text-sm text-muted-light text-center">
        You can skip this step and connect your bank account later in your dashboard.
      </p>
    </div>
  );
}

interface UserPreferences {
  savingsGoal: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  weeklyReports: boolean;
}

interface PreferencesStepProps {
  preferences: UserPreferences;
  setPreferences: (prefs: UserPreferences) => void;
}

function PreferencesStep({ preferences, setPreferences }: PreferencesStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground-black mb-2">
          Monthly Savings Goal
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="25"
            max="500"
            step="25"
            value={preferences.savingsGoal}
            onChange={(e) => setPreferences({
              ...preferences,
              savingsGoal: parseInt(e.target.value)
            })}
            className="flex-1"
          />
          <div className="w-20 text-center">
            <span className="text-lg font-semibold text-foreground-black">
              ${preferences.savingsGoal}
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-light mt-1">
          We&apos;ll help you identify subscriptions to cancel to reach this goal
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-foreground-black">Weekly Reports</h4>
            <p className="text-sm text-muted-light">Get weekly summaries of your subscriptions</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.weeklyReports}
              onChange={(e) => setPreferences({
                ...preferences,
                weeklyReports: e.target.checked
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

function NotificationsStep({ preferences, setPreferences }: PreferencesStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-foreground-black">Email Notifications</h4>
            <p className="text-sm text-muted-light">Get notified about new subscriptions and renewals</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.emailNotifications}
              onChange={(e) => setPreferences({
                ...preferences,
                emailNotifications: e.target.checked
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      <div className="bg-background-light-mid/50 rounded-lg p-4">
        <h4 className="font-medium text-foreground-black mb-2">What you&apos;ll get:</h4>
        <ul className="space-y-1 text-sm text-muted-light">
          <li className="flex items-center space-x-2">
            <Check className="w-3 h-3 text-green-500" />
            <span>New subscription alerts</span>
          </li>
          <li className="flex items-center space-x-2">
            <Check className="w-3 h-3 text-green-500" />
            <span>Renewal reminders</span>
          </li>
          <li className="flex items-center space-x-2">
            <Check className="w-3 h-3 text-green-500" />
            <span>Savings opportunities</span>
          </li>
          <li className="flex items-center space-x-2">
            <Check className="w-3 h-3 text-green-500" />
            <span>Monthly reports</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function CompleteStep() {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-10 h-10 text-white" />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-foreground-black mb-2">
          Welcome to KillSub! 🎉
        </h3>
        <p className="text-muted-light">
          You&apos;re now ready to start saving money by managing your subscriptions intelligently.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="bg-background-light-mid/50 rounded-lg p-4">
          <h4 className="font-semibold text-foreground-black mb-2">Next Steps:</h4>
          <ul className="space-y-1 text-muted-light text-left">
            <li>• Connect your bank account</li>
            <li>• Review detected subscriptions</li>
            <li>• Set up cancellation alerts</li>
            <li>• Start saving money!</li>
          </ul>
        </div>
        
        <div className="bg-background-light-mid/50 rounded-lg p-4">
          <h4 className="font-semibold text-foreground-black mb-2">Need Help?</h4>
          <ul className="space-y-1 text-muted-light text-left">
            <li>• Check our help center</li>
            <li>• Contact support</li>
            <li>• Watch tutorial videos</li>
            <li>• Join our community</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
