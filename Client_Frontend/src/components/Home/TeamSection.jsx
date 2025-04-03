import React, { useState } from 'react';
import { LinkedinIcon, MailIcon, UserCircle } from 'lucide-react';
import teamMembers from './teamMembers';

const TeamSection = () => {
  const [hoveredMember, setHoveredMember] = useState(null);
  
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Team
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Meet the experienced professionals who make Gamage Recruiters the leading recruitment agency in Sri Lanka.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {teamMembers.map((person) => (
            <div 
              key={person.name}
              className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
              onMouseEnter={() => setHoveredMember(person.name)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              <div className="flex items-center justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <UserCircle size={40} />
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold leading-7 tracking-tight text-gray-900">
                  {person.name}
                </h3>
                <p className="text-sm font-medium text-blue-600 mt-1">
                  {person.role}
                </p>
                
                <div className="mt-3 border-t border-gray-100 pt-3">
                  <p className="text-sm leading-6 text-gray-500">
                    {person.bio}
                  </p>
                </div>
                
                <div className="mt-6 flex justify-center space-x-5">
                  <a 
                    href={person.socialLinks.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    aria-label={`LinkedIn profile of ${person.name}`}
                  >
                    <LinkedinIcon size={20} />
                  </a>
                  <a 
                    href={`mailto:${person.socialLinks.email}`}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    aria-label={`Email ${person.name}`}
                  >
                    <MailIcon size={20} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamSection;