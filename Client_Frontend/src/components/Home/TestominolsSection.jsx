import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TestominolsSection = () => {
    const leftScrollRef = useRef(null);
    const [readmore, setReadmore] = useState(false);

    useEffect(() => {
        const animateLeftScroll = () => {
            if (leftScrollRef.current) {
                if (leftScrollRef.current.scrollLeft >= leftScrollRef.current.scrollWidth / 2) {
                    leftScrollRef.current.scrollLeft = 0;
                } else {
                    leftScrollRef.current.scrollLeft += 1;
                }
            }
        };

        const leftInterval = setInterval(animateLeftScroll, 30);

        return () => {
            clearInterval(leftInterval);
        };
    }, []);

    const testimonials = [
        {
            name: "Damayantha Surampika",
            role: "Senior Marketing Executive",
            company: "Gamage Recruiters",
            quote: "I am beyond grateful to Gamage Recruiters for connecting me with the perfect career opportunity. Their guidance and support helped me secure a role as a Senior Marketing Executive at a reputed firm, where I can truly showcase my skills. The recruitment team understood my strengths and aspirations, making the entire process smooth and stress-free. Thank you for paving the way for my professional growth!",
            image: "https://i.ibb.co/PvCfxjd9/gamage.png"
        },
        {
            name: "Sapthika Sandaruwani",
            role: "HR Coordinator",
            company: "Gamage Recruiters",
            quote: "Finding a job that aligns with my passion was made possible by Gamage Recruiters. They not only provided me with an opportunity but also mentored me throughout the selection process. Today, I am excelling as an HR Coordinator, thanks to their continuous support and encouragement. I truly appreciate their efforts in shaping my career!",
            image: "https://i.ibb.co/PvCfxjd9/gamage.png"
        },
        {
            name: "Rasika",
            role: "Software Engineer",
            company: "Gamage Recruiters",
            quote: "I had been searching for the right job for months, but it was Gamage Recruiters that finally helped me land my dream job as a Software Engineer. Their dedication and professionalism ensured I was matched with a company that values my expertise. I highly recommend them to anyone seeking a fulfilling career path. Thank you for making this journey so rewarding!",
            image: "https://i.ibb.co/PvCfxjd9/gamage.png"
        },
        {
            name: "Nehara Sampath",
            role: "Business Analyst",
            company: "Gamage Recruiters",
            quote: "Gamage Recruiters played a crucial role in my career transition by helping me secure a position as a Business Analyst. Their recruitment process was seamless, and they took the time to understand my career goals. I am now working at a company that challenges and excites me every day. Thank you for making this possible!",
            image: "https://i.ibb.co/PvCfxjd9/gamage.png"
        },
        {
            name: "Isuru Dananjaya",
            role: "Operations Manager",
            company: "Gamage Recruiters",
            quote: "I sincerely appreciate Gamage Recruiters for helping me take a major step forward in my career. With their assistance, I secured an Operations Manager role at a leading company, and I couldn’t be happier with the growth opportunities. Their professionalism and commitment to job seekers are truly commendable. Thank you for making a difference in my career!",
            image: "https://i.ibb.co/PvCfxjd9/gamage.png"
        },
        {
            name: "Nimsara Hettiarachchi",
            role: "Digital Marketing Specialist",
            company: "Gamage Recruiters",
            quote: "Thanks to Gamage Recruiters, I found a position that perfectly matches my skills and ambitions. Today, I am thriving as a Digital Marketing Specialist, working on projects I love and growing professionally every day. Their team was supportive, transparent, and always available to guide me. I couldn’t have done it without them!",
            image: "https://i.ibb.co/PvCfxjd9/gamage.png"
        },
        {
            name: "Saman Kumara",
            role: "Logistics Supervisor",
            company: "Gamage Recruiters",
            quote: "Gamage Recruiters helped me secure a stable and rewarding position as a Logistics Supervisor. Their support, from resume building to interview preparation, made all the difference in my job search. I am now part of a great team, and I owe my success to their exceptional recruitment services. Thank you for your unwavering support!",
            image: "https://i.ibb.co/PvCfxjd9/gamage.png"
        },
        {
            name: "H.P.Malith Kalinga",
            role: "Team Lead Intern",
            company: "Gamage Recruiters",
            quote: "My six-month internship as a Software Team Lead Intern at Gamage Recruiters was truly an unforgettable experience. I had the privilege of working with an incredible team, tackling real-world challenges, and growing both technically and personally. Every project we built, every problem we solved together, and every late-night debugging session shaped me into a more confident and skilled developer. The support and collaboration made it feel like more than just an internship—it felt like family. Grateful for every moment!",
            image: "https://i.ibb.co/PvCfxjd9/gamage.png"
        },
        {
            name: "Sonali Nipunika",
            role: "HR Coordinator ",
            company: "Gamage Recruiters",
            quote: "My full time opportunity at Gamage Recruiters was a turning point in my career. I gained hands-on experience in recruitment, employee engagement, and HR operations, which helped me secure a full-time Senior HR Executive. The mentorship and real-world exposure I received were invaluable. I am truly grateful for the opportunity!",
            image: "https://i.ibb.co/PvCfxjd9/gamage.png"
        },
        {
            name: "Kasun Jayasekara",
            role: "SE Intern",
            company: "Gamage Recruiters",
            quote: "Gamage Recruiters provided me with an incredible platform to enhance my technical and problem-solving skills. During my time here, I worked on real-world projects that strengthened my knowledge of the MERN stack. Today, I am a Full-Stack Developer and I owe a huge part of my success to the amazing learning experience I had at Gamage Recruiters!",
            image: "https://i.ibb.co/PvCfxjd9/gamage.png"
        },
        {
            name: "Nadeesha Wijesinghe",
            role: "BA Intern",
            company: "Gamage Recruiters",
            quote: "I started as a Business Analyst Intern at Gamage Recruiters, where I learned data analytics, market research, and business optimization strategies. The practical experience and guidance I received helped me land a role as a Data Analyst",
            image: "https://i.ibb.co/PvCfxjd9/gamage.png"
        },
        {
            name: "P.Jenojan",
            role: "SE Intern",
            company: "Gamage Recruiters",
            quote: "Gamage Recruiters gave me the perfect platform to develop my skills and gain industry exposure.",
            image: "https://i.ibb.co/PvCfxjd9/gamage.png"
        },
        {
            name: "Sadun Madusanka",
            role: "Social Media Marketing Intern",
            company: "Gamage Recruiters",
            quote: "Gamage Recruiters gave me the confidence to pursue a career in digital marketing. From managing LinkedIn and YouTube to developing content strategies, I gained valuable skills that helped me secure a full-time role as a Social Media Strategist.",
            image: "https://i.ibb.co/PvCfxjd9/gamage.png"
        },
        {
            name: "Rashmika Fernando",
            role: "UI/UX Intern",
            company: "Gamage Recruiters",
            quote: "Working as a Creative Designer for one year at Gamage Recruiters was an enriching experience. I had the opportunity to work on website and mobile UI/UX projects, which strengthened my design skills.",
            image: "https://i.ibb.co/PvCfxjd9/gamage.png"
        },
        {
            name: "Nashreen Kadeeja Liyanage",
            role: "HR Intern",
            company: "Gamage Recruiters",
            quote: "The first ever corporate experience was at Gamage Recruiters. For a period of 6 months, I received hands on quality experience regarding all HR operations and management. This gave me a head start and I'm currently pursuing a very valuable position because of them. If they hadn't given me a chance I don't know who would have! Forever grateful for all the support my team and I had. I wish nothing but success to the organization. Thank you once again❤️",
            image: "https://i.ibb.co/PvCfxjd9/gamage.png"
        },
        {
            name: "Ravindu Yasith",
            role: "Creative Designer Intern",
            company: "Gamage Recruiters",
            quote: "My internship at Gamage Recruiters was an incredible learning experience that helped me develop both my creative and leadership skills. As a Team Lead in the Creative Design team, I had the opportunity to oversee projects, manage tasks, and collaborate with a talented group of individuals. This experience sharpened my ability to think strategically, communicate effectively, and deliver compelling visual content. The fast-paced and dynamic environment at Gamage Recruiters prepared me for future roles and gave me the confidence to take on bigger responsibilities in my career. I’m grateful for the mentorship and hands-on experience I gained during my time there!",
            image: "https://i.ibb.co/PvCfxjd9/gamage.png"
        }
    ]

    // Duplicate partners array for smooth infinite scrolling
    const duplicatedTestominols = [...testimonials, ...testimonials, ...testimonials];

    return (
        <div className="bg-gradient-to-b from-gray-50 to-white py-24 scrollbar-none">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 scrollbar-none">
                <div className="text-center mb-16 scrollbar-none">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl scrollbar-none">
                        Success Stories
                    </h2>
                    <p className="mt-4 text-xl leading-8 text-gray-600">
                        Hear from professionals who found their dream careers through our platform
                    </p>
                </div>
                <div
                    ref={leftScrollRef}
                    className="flex overflow-x-auto py-4 scrollbar-none" // Updated this line for scroll behavior
                >
                    <div className="flex space-x-8 ">
                        {
                            testimonials.map((testimonial, index) => (
                                <div className={`bg-white rounded-xl shadow-md p-8 transform transition duration-500 hover:-translate-y-2 hover:shadow-xl border border-gray-100
                                    w-full sm:w-[400px] md:w-[400px] lg:w-[500px]
                                    ${readmore ? 'h-auto' : 'sm:h-[300px] md:h-[300px] lg:h-[300px]'}
                                  `}
                                >
                                    <div className="flex items-center mb-6">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full mr-4 object-cover"
                                        />
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                                            <p className="text-sm text-indigo-600">{testimonial.role} at {testimonial.company}</p>
                                        </div>
                                    </div>
                                    {readmore === false ? (
                                        <p className="text-gray-600 italic line-clamp-4">"{testimonial.quote}"</p>
                                    ) :
                                        (<p className="text-gray-600 italic">"{testimonial.quote}"</p>

                                        )}
                                    {readmore === false ? (
                                        <div className="flex items-center text-indigo-600 font-medium" onClick={() => setReadmore(true)} style={{ cursor: 'pointer' }} >
                                            Read more ...
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-indigo-600 font-medium" onClick={() => setReadmore(false)} style={{ cursor: 'pointer' }} >
                                            Read less ...
                                        </div>
                                    )}
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div >


    );
};

export default TestominolsSection;


{/* <div className="bg-gradient-to-r from-indigo-50 to-blue-50 py-20 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        <span className="relative">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                                Trusted Partners
                            </span>
                            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-blue-500 transform scale-x-75 rounded-full mx-auto w-24"></span>
                        </span>
                    </h2>
                    <p className="mt-6 text-xl leading-8 text-gray-600 max-w-2xl mx-auto">
                        We collaborate with industry leaders to bring you the best opportunities across Sri Lanka
                    </p>
                </div>

               
 <div className="mb-8 relative">
    <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-indigo-50 to-transparent z-10"></div>
    <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-blue-50 to-transparent z-10"></div>

    <div
        ref={leftScrollRef}
        className="flex overflow-x-hidden whitespace-nowrap py-4"
    >
        <div className="flex space-x-8 inline-block">
            {duplicatedTestominols.map((testimonial, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl shadow-md p-6 transition duration-500 hover:-translate-y-2 hover:shadow-xl border border-gray-100 
                w-[600px] h-[300px] flex flex-col justify-between"
                >
                    
                    <div>
                        <div className="flex items-center mb-4">
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-12 h-12 rounded-full mr-4 object-cover"
                            />
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                                <p className="text-sm text-indigo-600">{testimonial.role} at {testimonial.company}</p>
                            </div>
                        </div>

                        
                        <p className="text-gray-600 italic line-clamp-4 overflow-hidden break-words text-left">
                            "{testimonial.quote}"
                        </p>
                    </div>
                    <div className="mt-auto">
                        <button className="text-indigo-600 font-semibold hover:underline">Read more...</button>
                    </div>
                </div>


            ))}
        </div>
    </div>
</div>
            </div >
        </div > */}