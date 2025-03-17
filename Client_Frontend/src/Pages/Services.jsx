import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const services = [
  {
    title: 'Permanent Recruitment',
    description: 'End-to-end recruitment solutions for permanent positions across all industry sectors.',
    features: [
      'Comprehensive candidate screening',
      'Industry-specific expertise',
      'Salary benchmarking',
      'Interview coordination',
      'Offer management',
      'Post-placement support'
    ]
  },
  {
    title: 'Contract Staffing',
    description: 'Flexible staffing solutions for project-based and temporary requirements.',
    features: [
      'Quick turnaround time',
      'Verified contractor database',
      'Payroll management',
      'Contract administration',
      'Performance monitoring',
      'Contract extensions'
    ]
  },
  {
    title: 'Executive Search',
    description: 'Specialized search for senior management and executive positions.',
    features: [
      'Confidential search process',
      'Market mapping',
      'Headhunting',
      'Leadership assessment',
      'Negotiation support',
      'Executive onboarding'
    ]
  },
  {
    title: 'HR Consulting',
    description: 'Strategic HR solutions to optimize your organizational effectiveness.',
    features: [
      'HR policy development',
      'Performance management',
      'Compensation structuring',
      'Training needs analysis',
      'Employee engagement',
      'HR audit'
    ]
  }
];

const industries = [
  'Information Technology',
  'Banking & Finance',
  'Manufacturing',
  'Healthcare',
  'Retail',
  'Construction',
  'Education',
  'Telecommunications'
];

export default function Services() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-black py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Our Services</h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Comprehensive recruitment and HR solutions tailored to meet your organizational needs.
              We combine industry expertise with innovative approaches to deliver exceptional results.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {services.map((service, index) => (
              <div key={service.title} className="lg:pr-8 lg:pt-4">
                <div className="lg:max-w-lg">
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{service.title}</h2>
                  <p className="mt-6 text-lg leading-8 text-gray-600">{service.description}</p>
                  <dl className="mt-10 max-w-xl space-y-4 text-base leading-7 text-gray-600">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex gap-x-3">
                        <CheckCircleIcon className="h-7 w-5 flex-none text-black" aria-hidden="true" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Industries Section */}
      <div className="bg-black py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Industries We Serve</h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Our expertise spans across multiple industries, allowing us to understand and meet the unique requirements of each sector.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {industries.map((industry) => (
                <div key={industry} className="flex flex-col items-center">
                  <dt className="text-lg font-semibold leading-7 text-white text-center">{industry}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Ready to enhance your recruitment process?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Let's discuss how our services can help you find and retain the best talent for your organization.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/contact"
                className="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Contact Us
              </Link>
              <Link
                to="/jobs"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                View Open Positions <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}