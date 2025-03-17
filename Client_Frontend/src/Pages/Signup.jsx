import { Link } from "react-router-dom";
import { useState } from "react";
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaPhone, 
  FaBirthdayCake, 
  FaLinkedin, 
  FaFacebook, 
  FaLink, 
  FaPortrait,
  FaMapMarkerAlt,
  FaArrowRight,
  FaCheck,
  FaFileUpload
} from "react-icons/fa";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birthDate: '',
    address: '',
    address2: '',
    phoneNumber1: '',
    phoneNumber2: '',
    portfolioLink: '',
    linkedInLink: '',
    facebookLink: '',
    profileDescription: '',
    cv: null,
    photo: null
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    console.log("Signing up", formData);
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0]
    });
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'confirmPassword' || e.target.name === 'password') {
      setPasswordError('');
    }
    
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const nextStep = () => {
    if (currentStep === 4 && formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setCurrentStep(Math.min(currentStep + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-indigo-800 to-purple-200">
    

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress indicator */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-6">
              Create Your Professional Profile
            </h1>
            
            <div className="flex justify-center mb-2">
              <div className="text-sm font-medium text-white">
                Step {currentStep} of {totalSteps}
              </div>
            </div>
            
            <div className="flex justify-between items-center max-w-3xl mx-auto px-6">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-black text-sm font-medium 
                    ${i + 1 < currentStep ? 'bg-green-500' : i + 1 === currentStep ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    {i + 1 < currentStep ? <FaCheck /> : i + 1}
                  </div>
                  <div className="hidden md:block text-xs mt-1 font-medium text-gray-600">
                    {i === 0 ? 'Personal' : 
                     i === 1 ? 'Contact' : 
                     i === 2 ? 'Social' : 
                     i === 3 ? 'Security' : 'Documents'}
                  </div>
                </div>
              ))}
              <div className="absolute left-0 right-0 h-0.5 bg-gray-200" style={{ top: '1rem', zIndex: -1 }}>
                <div 
                  className="h-full bg-blue-600 transition-all duration-300" 
                  style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            {/* Step 1: Personal Information */}
            <div className={`transition-all duration-500 transform ${currentStep === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute'}`}>
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex items-center mb-8 text-blue-700">
                  <FaUser size={24} className="mr-3" />
                  <h2 className="text-2xl font-bold">Personal Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <div className="group">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="John"
                        className="w-full outline-none border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <div className="group">
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Doe"
                        className="w-full outline-none border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      name="gender"
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                      required
                      onChange={handleInputChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <div className="flex items-center border border-gray-300 px-4 py-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                      <FaBirthdayCake className="text-gray-400 mr-2" />
                      <input
                        type="date"
                        name="birthDate"
                        className="w-full outline-none"
                        required
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all flex items-center"
                >
                  Continue <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>

            {/* Step 2: Contact Information */}
            <div className={`transition-all duration-500 transform ${currentStep === 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute'}`}>
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex items-center mb-8 text-blue-700">
                  <FaMapMarkerAlt size={24} className="mr-3" />
                  <h2 className="text-2xl font-bold">Contact Information</h2>
                </div>

                <div className="space-y-6">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Address *
                    </label>
                    <div className="flex items-center border border-gray-300 px-4 py-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                      <input
                        type="text"
                        name="address"
                        placeholder="Street Address"
                        className="w-full outline-none"
                        required
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Address
                    </label>
                    <div className="flex items-center border border-gray-300 px-4 py-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                      <input
                        type="text"
                        name="address2"
                        placeholder="Apartment, Suite, etc."
                        className="w-full outline-none"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Phone *
                      </label>
                      <div className="flex items-center border border-gray-300 px-4 py-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                        <FaPhone className="text-gray-400 mr-2" />
                        <input
                          type="tel"
                          name="phoneNumber1"
                          placeholder="+94 77 123 4567"
                          className="w-full outline-none"
                          required
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary Phone
                      </label>
                      <div className="flex items-center border border-gray-300 px-4 py-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                        <FaPhone className="text-gray-400 mr-2" />
                        <input
                          type="tel"
                          name="phoneNumber2"
                          placeholder="+94 76 765 4321"
                          className="w-full outline-none"
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all flex items-center"
                >
                  Continue <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>

            {/* Step 3: Social & Professional Links */}
            <div className={`transition-all duration-500 transform ${currentStep === 3 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute'}`}>
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex items-center mb-8 text-blue-700">
                  <FaLink size={24} className="mr-3" />
                  <h2 className="text-2xl font-bold">Social & Professional Links</h2>
                </div>

                <div className="space-y-6">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile
                    </label>
                    <div className="flex items-center border border-gray-300 px-4 py-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                      <FaLinkedin className="text-blue-600 mr-2" />
                      <input
                        type="url"
                        name="linkedInLink"
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="w-full outline-none"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook Profile
                    </label>
                    <div className="flex items-center border border-gray-300 px-4 py-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                      <FaFacebook className="text-blue-700 mr-2" />
                      <input
                        type="url"
                        name="facebookLink"
                        placeholder="https://facebook.com/yourprofile"
                        className="w-full outline-none"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio Website
                    </label>
                    <div className="flex items-center border border-gray-300 px-4 py-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                      <FaLink className="text-gray-500 mr-2" />
                      <input
                        type="url"
                        name="portfolioLink"
                        placeholder="https://yourportfolio.com"
                        className="w-full outline-none"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all flex items-center"
                >
                  Continue <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>

            {/* Step 4: Account Security */}
            <div className={`transition-all duration-500 transform ${currentStep === 4 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute'}`}>
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex items-center mb-8 text-blue-700">
                  <FaLock size={24} className="mr-3" />
                  <h2 className="text-2xl font-bold">Account Security</h2>
                </div>

                <div className="space-y-6">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="flex items-center border border-gray-300 px-4 py-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                      <FaEnvelope className="text-gray-400 mr-2" />
                      <input
                        type="email"
                        name="email"
                        placeholder="john.doe@example.com"
                        className="w-full outline-none"
                        required
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="flex items-center border border-gray-300 px-4 py-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                      <FaLock className="text-gray-400 mr-2" />
                      <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        className="w-full outline-none"
                        required
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="flex items-center border border-gray-300 px-4 py-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                      <FaLock className="text-gray-400 mr-2" />
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="••••••••"
                        className="w-full outline-none"
                        required
                        onChange={handleInputChange}
                      />
                    </div>
                    {passwordError && (
                      <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Both passwords should be the same.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all flex items-center"
                >
                  Continue <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>

            {/* Step 5: Documents & Profile Description */}
            <div className={`transition-all duration-500 transform ${currentStep === 5 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute'}`}>
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-8">
                <div className="flex items-center mb-8 text-blue-700">
                  <FaFileUpload size={24} className="mr-3" />
                  <h2 className="text-2xl font-bold">Documents & Media</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Upload CV (PDF) *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-all cursor-pointer">
                      <input
                        type="file"
                        name="cv"
                        accept=".pdf"
                        className="hidden"
                        id="cv-upload"
                        required
                        onChange={handleFileChange}
                      />
                      <label htmlFor="cv-upload" className="cursor-pointer">
                        <FaFileUpload className="mx-auto text-gray-400 text-3xl mb-2" />
                        <p className="text-sm text-gray-500">
                          Drag and drop your CV here, or <span className="text-blue-600 font-medium">browse</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">PDF format only</p>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Profile Photo
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-all cursor-pointer">
                      <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        className="hidden"
                        id="photo-upload"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <FaPortrait className="mx-auto text-gray-400 text-3xl mb-2" />
                        <p className="text-sm text-gray-500">
                          Drag and drop your photo here, or <span className="text-blue-600 font-medium">browse</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF format</p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Description *
                  </label>
                  <textarea
                    name="profileDescription"
                    placeholder="Describe your professional background, skills, and career achievements..."
                    className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-40"
                    required
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    This description will be visible to recruiters and helps them understand your qualifications.
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="flex justify-between mb-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg 
                              hover:shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Complete Registration
                  </button>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    By creating an account, you agree to our{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}