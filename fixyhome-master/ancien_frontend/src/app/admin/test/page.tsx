"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminTestPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [testResults, setTestResults] = useState<any[]>([]);

  useEffect(() => {
    runTests();
  }, [user, isAuthenticated, isLoading]);

  const runTests = async () => {
    const results = [];
    
    // Test 1: Check localStorage
    const token = localStorage.getItem('token');
    results.push({
      test: 'Token in localStorage',
      status: token ? 'PASS' : 'FAIL',
      details: token ? 'Token exists' : 'No token found'
    });

    // Test 2: Check user object
    results.push({
      test: 'User object exists',
      status: user ? 'PASS' : 'FAIL',
      details: user ? `User: ${user.email}, Type: ${user.userType}` : 'No user object'
    });

    // Test 3: Check authentication status
    results.push({
      test: 'Is authenticated',
      status: isAuthenticated ? 'PASS' : 'FAIL',
      details: `Authenticated: ${isAuthenticated}`
    });

    // Test 4: Check user type
    results.push({
      test: 'User type is ADMIN',
      status: user?.userType === 'ADMIN' ? 'PASS' : 'FAIL',
      details: `User type: ${user?.userType || 'undefined'}`
    });

    // Test 5: Check loading state
    results.push({
      test: 'Loading state',
      status: !isLoading ? 'PASS' : 'FAIL',
      details: `Loading: ${isLoading}`
    });

    // Test 6: Check profiles in localStorage
    const profiles = typeof window !== 'undefined' ? localStorage.getItem('profiles') : null;
    results.push({
      test: 'Profiles in localStorage',
      status: profiles ? 'PASS' : 'FAIL',
      details: profiles ? 'Profiles exist' : 'No profiles found'
    });

    // Test 7: Check current profile
    const currentProfile = typeof window !== 'undefined' ? localStorage.getItem('currentProfile') : null;
    results.push({
      test: 'Current profile in localStorage',
      status: currentProfile ? 'PASS' : 'FAIL',
      details: currentProfile ? 'Current profile exists' : 'No current profile'
    });

    // Test 8: Try to decode token (basic check)
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (storedToken) {
      try {
        const parts = storedToken.split('.');
        const payload = JSON.parse(atob(parts[1]));
        results.push({
          test: 'Token decode',
          status: 'PASS',
          details: `Token payload: ${JSON.stringify(payload, null, 2)}`
        });
      } catch (e) {
        results.push({
          test: 'Token decode',
          status: 'FAIL',
          details: `Error decoding token: ${e}`
        });
      }
    }

    setTestResults(results);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@fixyhome.com',
          password: 'admin123'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.token);
          
          // Create profile data
          const profileData = {
            id: data.id,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone || '',
            userType: data.userType,
            token: data.token,
            profileName: `${data.firstName} ${data.lastName}`,
            createdBy: 'test',
          };

          localStorage.setItem('currentProfile', JSON.stringify(profileData));
          localStorage.setItem('profiles', JSON.stringify([profileData]));
          
          window.location.reload();
        }
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Test Page</h1>
        
        {/* Test Results */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h2>
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div key={index} className={`p-3 rounded ${result.status === 'PASS' ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{result.test}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    result.status === 'PASS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {result.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{result.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Test Login (Admin)
            </button>
            
            <button
              onClick={() => window.location.href = '/admin/dashboard'}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Go to Admin Dashboard
            </button>
            
            <button
              onClick={() => window.location.href = '/admin/dashboard/simple'}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Go to Simple Dashboard
            </button>
            
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.clear();
                  window.location.href = '/login';
                }
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Clear All & Go to Login
            </button>
          </div>
        </div>

        {/* Current State */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current State</h2>
          <pre className="text-sm text-gray-600 overflow-x-auto">
            {JSON.stringify({
              user: user,
              isAuthenticated: isAuthenticated,
              isLoading: isLoading,
              token: typeof window !== 'undefined' && localStorage.getItem('token') ? 'exists' : 'none',
              timestamp: new Date().toISOString()
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
