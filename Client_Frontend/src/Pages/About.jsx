import { Link } from 'react-router-dom';
import TestominolsSection from '../components/Home/TestominolsSection';
import TeamMembers from '../components/Home/TeamSection';


const stats = [
  { label: 'Years in Business', value: '10+' },
  { label: 'Successful Placements', value: '5000+' },
  { label: 'Client Companies', value: '200+' },
  { label: 'Industry Sectors', value: '15+' }
];

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-black py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">About Us</h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Gamage Recruiters has been bridging the gap between talented professionals and leading companies since 2013.
              Our deep understanding of the Sri Lankan job market and commitment to excellence has made us a trusted name in recruitment.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Mission</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              To revolutionize the recruitment industry in Sri Lanka by providing innovative solutions that connect the right talent
              with the right opportunities, while fostering growth and success for both candidates and employers.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-black py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Trusted by hundreds of companies and thousands of job seekers
              </h2>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col bg-white/5 p-8">
                  <dt className="text-sm font-semibold leading-6 text-gray-300">{stat.label}</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-white">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <TeamMembers/>
      

      <TestominolsSection />
      {/* CTA Section */}
      <div className="bg-black">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to transform your career?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Join thousands of professionals who've found their perfect career match through Gamage Recruiters.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/jobs"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                View Open Positions
              </Link>
              <Link
                to="/contact"
                className="text-sm font-semibold leading-6 text-white"
              >
                Contact Us <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}