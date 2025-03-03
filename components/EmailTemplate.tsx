'use client';

import * as React from 'react';
import { Mail } from 'lucide-react';

interface EmailTemplateProps {
  firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <div className="text-center">
      <Mail className="w-12 h-12 mx-auto text-blue-500" />
      <h1 className="mt-4 text-2xl font-bold text-gray-800">Welcome, {firstName}!</h1>
    </div>
    <div className="mt-6 text-gray-600">
      <p className="mb-4">We're thrilled to have you join our platform. Here's what you can expect:</p>
      <ul className="space-y-2">
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Access to exclusive features
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Personalized recommendations
        </li>
        <li className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          24/7 customer support
        </li>
      </ul>
    </div>
    <div className="mt-8 text-center">
      <p className="text-sm text-gray-500">If you have any questions, feel free to reply to this email.</p>
    </div>
  </div>
);
