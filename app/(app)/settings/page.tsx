/**
 * Settings Page
 * 
 * Placeholder page for future settings and preferences.
 * Phase 1 only includes a mock section to indicate where
 * settings will eventually be implemented
 * 
 * Route: /settings
 */
import {Card} from "@/components/ui/card";
import {Settings as SettingsIcon } from "lucide-react";

/**
 * SettingsPage component
 * 
 * Simple placeholder page showing where settings will be added in future phases
 * 
 * @returns Rendered settings page
 */
export default function SettingsPage(){
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/*Page header*/}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Customize your Courseflow experience
        </p>
      </div>

      {/*Prefences mock section*/}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-indigo-100 rounded-lg p-3">
            <SettingsIcon className="w-6 h-6 text-indigo-600"/>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Preferences (mock)
            </h2>

            <p className="text-gray-600 mb-4">
              Settings functionality will be implemented in future phases. 
              This section will include:
            </p>

            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">.</span>
                <span>
                  <strong>Scheduling preferences:</strong> Set your preferred study times, break durations, and work session lengths
                </span>
              </li>

              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">.</span>
                <span>
                  <strong>Notification options:</strong> Configure reminders for upcoming
                  study blocks and assignment deadlines
                </span>
              </li>

              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">.</span>
                <span>
                  <strong>Canvas integration:</strong> Connect your canvas account to automatically import
                  assignments and due dates
                </span>
              </li>

              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">.</span>
                <span>
                  <strong>Display options: </strong> Customize calendar view, time format (12/24hr), and color schemes
                </span>
              </li>

              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">.</span>
                <span>
                  <strong> AI scheduling engine: </strong> Configure the automatic scheduling algorithm to 
                  match your study habits
                </span>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Phase 1 Note:</strong> This is a placeholder page.
                Phase 1 focuses on the UI and interactions with mock data. Settings and 
                integration will be added in Phase 2.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
