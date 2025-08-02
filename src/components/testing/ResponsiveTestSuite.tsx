import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Smartphone, Tablet, Monitor } from 'lucide-react';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';
import { useIsIOS, useIsAndroid } from '@/hooks/useIsIOS';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  details: string;
}

const ResponsiveTestSuite: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isIOS = useIsIOS();
  const isAndroid = useIsAndroid();

  const runResponsiveTests = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    // Device Detection Tests
    results.push({
      name: 'Device Detection',
      status: 'pass',
      details: `Mobile: ${isMobile}, Tablet: ${isTablet}, iOS: ${isIOS}, Android: ${isAndroid}`
    });

    // Viewport Tests
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    results.push({
      name: 'Viewport Dimensions',
      status: viewportWidth > 320 ? 'pass' : 'fail',
      details: `${viewportWidth}x${viewportHeight}px`
    });

    // Touch Target Tests
    const buttons = document.querySelectorAll('button');
    let touchTargetPass = true;
    buttons.forEach(button => {
      const rect = button.getBoundingClientRect();
      if (isMobile && (rect.height < 44 || rect.width < 44)) {
        touchTargetPass = false;
      }
    });
    results.push({
      name: 'Touch Target Sizes',
      status: touchTargetPass ? 'pass' : 'warning',
      details: `${buttons.length} buttons checked, min 44px for iOS`
    });

    // Select Dropdown Tests
    const selects = document.querySelectorAll('[data-radix-select-trigger]');
    results.push({
      name: 'Select Components',
      status: selects.length > 0 ? 'pass' : 'warning',
      details: `${selects.length} select components found`
    });

    // Z-index Tests
    const dropdowns = document.querySelectorAll('[data-radix-select-content]');
    let zIndexPass = true;
    dropdowns.forEach(dropdown => {
      const style = window.getComputedStyle(dropdown);
      const zIndex = parseInt(style.zIndex);
      if (zIndex < 99999) zIndexPass = false;
    });
    results.push({
      name: 'Dropdown Z-Index',
      status: zIndexPass ? 'pass' : 'warning',
      details: 'Checking z-index: 99999 for dropdowns'
    });

    // CSS Grid/Flexbox Tests
    const grids = document.querySelectorAll('[class*="grid"]');
    const flexboxes = document.querySelectorAll('[class*="flex"]');
    results.push({
      name: 'Responsive Layout',
      status: 'pass',
      details: `${grids.length} grids, ${flexboxes.length} flexbox containers`
    });

    // Font Size Tests
    const body = document.body;
    const fontSize = window.getComputedStyle(body).fontSize;
    results.push({
      name: 'Base Font Size',
      status: parseInt(fontSize) >= 16 ? 'pass' : 'warning',
      details: `${fontSize} (minimum 16px recommended)`
    });

    // Media Query Tests
    const breakpoints = [
      { name: 'Mobile', query: '(max-width: 767px)' },
      { name: 'Tablet', query: '(min-width: 768px) and (max-width: 1023px)' },
      { name: 'Desktop', query: '(min-width: 1024px)' }
    ];

    breakpoints.forEach(bp => {
      const matches = window.matchMedia(bp.query).matches;
      results.push({
        name: `${bp.name} Breakpoint`,
        status: 'pass',
        details: `${bp.query}: ${matches ? 'Active' : 'Inactive'}`
      });
    });

    // Performance Tests
    const performanceEntries = performance.getEntriesByType('navigation');
    if (performanceEntries.length > 0) {
      const navigation = performanceEntries[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      results.push({
        name: 'Page Load Performance',
        status: loadTime < 3000 ? 'pass' : 'warning',
        details: `${Math.round(loadTime)}ms (target: <3000ms)`
      });
    }

    setTestResults(results);
    setIsRunning(false);
  };

  useEffect(() => {
    // Auto-run tests on component mount
    runResponsiveTests();
  }, []);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'fail':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getDeviceIcon = () => {
    if (isMobile) return <Smartphone className="w-6 h-6 text-blue-600" />;
    if (isTablet) return <Tablet className="w-6 h-6 text-purple-600" />;
    return <Monitor className="w-6 h-6 text-gray-600" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {getDeviceIcon()}
            Responsive Design Test Suite
            <Badge variant="outline" className="ml-auto">
              {testResults.filter(r => r.status === 'pass').length}/{testResults.length} Tests Passed
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-center">
            <Button 
              onClick={runResponsiveTests} 
              disabled={isRunning}
              className="bg-academy-blue hover:bg-academy-purple"
            >
              {isRunning ? 'Running Tests...' : 'Run Tests'}
            </Button>
            
            <div className="text-sm text-gray-600">
              Current Device: {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'} 
              {isIOS && ' (iOS)'} {isAndroid && ' (Android)'}
            </div>
          </div>

          <div className="grid gap-3">
            {testResults.map((result, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <div className="font-medium">{result.name}</div>
                  <div className="text-sm text-gray-600">{result.details}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Test Elements */}
          <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <h4 className="font-medium mb-3">Interactive Test Elements</h4>
            <div className="space-y-3">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Test Dropdown (Check z-index and touch behavior)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="test1">Test Option 1</SelectItem>
                  <SelectItem value="test2">Test Option 2</SelectItem>
                  <SelectItem value="test3">Test Option 3</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex gap-2 flex-wrap">
                <Button size="sm">Small Button</Button>
                <Button>Normal Button</Button>
                <Button size="lg">Large Button</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponsiveTestSuite;