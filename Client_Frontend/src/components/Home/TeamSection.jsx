import React, { useState } from 'react';
import { LinkedinIcon, MailIcon } from 'lucide-react';
import teamMembers from './teamMembers';

const TeamSection = () => {
  const [hoveredMember, setHoveredMember] = useState(null);

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Team
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Meet the experienced professionals who make Gamage Recruiters the leading recruitment agency in Sri Lanka.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4"
        >
          {teamMembers.map((person) => (
            <li 
              key={person.name} 
              className="relative group"
              onMouseEnter={() => setHoveredMember(person.name)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              <div className="relative overflow-hidden">
                <img 
                  className="aspect-[3/2] w-full rounded-2xl object-cover transition-transform duration-300 group-hover:scale-110" 
                  src={person.image} 
                  alt={person.name} 
                />
                {hoveredMember === person.name && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-300">
                    <div className="flex space-x-4">
                      <a 
                        href={person.socialLinks.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white hover:text-blue-300 transition-colors"
                      >
                        <LinkedinIcon size={24} />
                      </a>
                      <a 
                        href={`mailto:${person.socialLinks.email}`}
                        className="text-white hover:text-blue-300 transition-colors"
                      >
                        <MailIcon size={24} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">
                {person.name}
              </h3>
              <p className="text-base leading-7 text-gray-600">
                {person.role}
              </p>
              <p className="mt-4 text-sm leading-6 text-gray-500">
                {person.bio}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeamSection;