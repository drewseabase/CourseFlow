/**
 * Course Flow Landing page
 * 
 * Main landing page 
 * Simple, clean design introducing the app
 * 
 * Route: /
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, CheckSquare, Settings, ArrowRight } from "lucide-react";

/**
 * HomePage component
 * Landing page with hero section and navigation
 * 
 * @returns Rendered landing page
 */
export default function HomePage(){
 return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Courseflow</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-2">
              <Link href="/calendar">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Calendar</span>
                </Button>
              </Link>
              
              <Link href="/today">
                <Button variant="ghost" className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  <span>Today</span>
                </Button>
              </Link>
              
              <Link href="/settings">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            {/* Hero Content */}
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Welcome to Courseflow
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Your smart scheduling assistant for managing assignments and study time
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* Calendar Card */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Weekly Calendar
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  View your entire week with classes, work, and study blocks
                </p>
                <Link href="/calendar">
                  <Button variant="outline" size="sm" className="w-full">
                    Open Calendar
                  </Button>
                </Link>
              </div>

              {/* Today Card */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckSquare className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Today's Tasks
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Focus on what needs to be done today
                </p>
                <Link href="/today">
                  <Button variant="outline" size="sm" className="w-full">
                    View Today
                  </Button>
                </Link>
              </div>

              {/* Settings Card */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Settings
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Customize your scheduling preferences
                </p>
                <Link href="/settings">
                  <Button variant="outline" size="sm" className="w-full">
                    Configure
                  </Button>
                </Link>
              </div>
            </div>

            {/* CTA Button */}
            <Link href="/calendar">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>Courseflow - Student Scheduling Assistant (Phase 1)</p>
        </div>
      </footer>
    </div>
  );
}
