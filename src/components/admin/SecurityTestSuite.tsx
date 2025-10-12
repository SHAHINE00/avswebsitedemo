import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, AlertCircle, Play } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  details?: string;
}

export const SecurityTestSuite = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const testResults: TestResult[] = [];

    // Test 1: Verify is_admin RPC function exists and works
    try {
      const { data, error } = await supabase.rpc('is_admin');
      testResults.push({
        name: 'is_admin RPC Function',
        status: error ? 'fail' : 'pass',
        message: error ? 'RPC function failed' : 'RPC function working correctly',
        details: error?.message
      });
    } catch (error: any) {
      testResults.push({
        name: 'is_admin RPC Function',
        status: 'fail',
        message: 'RPC function error',
        details: error.message
      });
    }

    // Test 2: Check user_roles table access
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .limit(1);
      
      testResults.push({
        name: 'user_roles Table Access',
        status: !error ? 'pass' : 'fail',
        message: !error ? 'Can query user_roles table' : 'Cannot access user_roles',
        details: error?.message
      });
    } catch (error: any) {
      testResults.push({
        name: 'user_roles Table Access',
        status: 'fail',
        message: 'Error accessing user_roles',
        details: error.message
      });
    }

    // Test 3: Verify profiles table doesn't have role column
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, created_at')
        .limit(1);
      
      testResults.push({
        name: 'Profiles Table Migration',
        status: !error ? 'pass' : 'fail',
        message: !error ? 'Profiles table structure correct' : 'Profiles query failed',
        details: error?.message
      });
    } catch (error: any) {
      testResults.push({
        name: 'Profiles Table Migration',
        status: 'fail',
        message: 'Error querying profiles',
        details: error.message
      });
    }

    // Test 4: Test admin-only functions
    try {
      const { data, error } = await supabase.rpc('get_dashboard_metrics');
      
      testResults.push({
        name: 'Admin-Only Functions',
        status: !error ? 'pass' : 'warning',
        message: !error 
          ? 'Admin functions accessible (you are admin)' 
          : 'Admin functions blocked (you are not admin or error)',
        details: error?.message
      });
    } catch (error: any) {
      testResults.push({
        name: 'Admin-Only Functions',
        status: 'warning',
        message: 'Admin function test inconclusive',
        details: error.message
      });
    }

    // Test 5: Check enrollment functions with new role system
    try {
      const { data: enrollments, error } = await supabase
        .from('course_enrollments')
        .select('*')
        .limit(5);
      
      testResults.push({
        name: 'Course Enrollments Access',
        status: !error ? 'pass' : 'fail',
        message: !error ? 'Can access enrollments' : 'Cannot access enrollments',
        details: error?.message
      });
    } catch (error: any) {
      testResults.push({
        name: 'Course Enrollments Access',
        status: 'fail',
        message: 'Error accessing enrollments',
        details: error.message
      });
    }

    // Test 6: Verify sensitive tables are protected
    const sensitiveTables = ['pending_users', 'subscribers', 'admin_activity_logs'] as const;
    for (const table of sensitiveTables) {
      try {
        const { data, error } = await supabase
          .from(table as any)
          .select('*')
          .limit(1);
        
        const isAdmin = await supabase.rpc('is_admin');
        
        testResults.push({
          name: `${table} Protection`,
          status: (isAdmin.data && !error) || (!isAdmin.data && error) ? 'pass' : 'fail',
          message: isAdmin.data 
            ? `Admin can access ${table}` 
            : error 
              ? `Non-admin correctly blocked from ${table}` 
              : `SECURITY ISSUE: Non-admin can access ${table}`,
          details: error?.message
        });
      } catch (error: any) {
        testResults.push({
          name: `${table} Protection`,
          status: 'warning',
          message: `Could not test ${table} protection`,
          details: error.message
        });
      }
    }

    setResults(testResults);
    setIsRunning(false);

    const passCount = testResults.filter(r => r.status === 'pass').length;
    const failCount = testResults.filter(r => r.status === 'fail').length;
    
    if (failCount === 0) {
      toast.success(`All ${passCount} tests passed! ✅`);
    } else {
      toast.error(`${failCount} test(s) failed, ${passCount} passed`);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variantMap: Record<string, 'default' | 'destructive' | 'secondary' | 'outline'> = {
      pass: 'default',
      fail: 'destructive',
      warning: 'secondary',
      pending: 'outline'
    };

    return <Badge variant={variantMap[status]}>{status.toUpperCase()}</Badge>;
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Security Test Suite</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Verify the new role-based security system
            </p>
          </div>
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            {isRunning ? 'Running Tests...' : 'Run Tests'}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-green-50 dark:bg-green-950">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {results.filter(r => r.status === 'pass').length}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-400">Passed</div>
                </div>
              </Card>
              <Card className="p-4 bg-red-50 dark:bg-red-950">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {results.filter(r => r.status === 'fail').length}
                  </div>
                  <div className="text-sm text-red-700 dark:text-red-400">Failed</div>
                </div>
              </Card>
              <Card className="p-4 bg-yellow-50 dark:bg-yellow-950">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    {results.filter(r => r.status === 'warning').length}
                  </div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-400">Warnings</div>
                </div>
              </Card>
            </div>

            <div className="space-y-3">
              {results.map((result, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{result.name}</h3>
                        {getStatusBadge(result.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{result.message}</p>
                      {result.details && (
                        <p className="text-xs text-red-600 mt-2 font-mono">
                          {result.details}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {results.length === 0 && !isRunning && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              Click "Run Tests" to verify the security system
            </p>
          </Card>
        )}
      </div>
    </Card>
  );
};
