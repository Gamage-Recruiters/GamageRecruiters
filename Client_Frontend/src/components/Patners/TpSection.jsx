import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TPSection = () => {
  const leftScrollRef = useRef(null);
  const rightScrollRef = useRef(null);

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

    const animateRightScroll = () => {
      if (rightScrollRef.current) {
        if (rightScrollRef.current.scrollLeft <= 0) {
          rightScrollRef.current.scrollLeft = rightScrollRef.current.scrollWidth / 2;
        } else {
          rightScrollRef.current.scrollLeft -= 1;
        }
      }
    };

    const leftInterval = setInterval(animateLeftScroll, 30);
    const rightInterval = setInterval(animateRightScroll, 30);

    return () => {
      clearInterval(leftInterval);
      clearInterval(rightInterval);
    };
  }, []);

  const partners = [
    { id: 1, name: "CBL", logo: "https://d1l8km4g5s76x5.cloudfront.net/Production/exb_doc/2015/16038/thumb_2015_16038_15864_4687.png", category: "Food & Beverage" },
    { id: 2, name: "Abans", logo: "data:image/png;base64,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", category: "Electrical" },
    { id: 3, name: "Palawatte Diaries", logo: "https://www.hac.lk/uploads/brand/pelwatte-LSrs5cqkat.png", category: "Food & Beverage" },
    { id: 4, name: "Union Assurance", logo: "https://upload.wikimedia.org/wikipedia/en/0/0a/Union_Assurance_logo.png", category: "Insurance" },
    { id: 5, name: "Cambridege College", logo: "https://i.ibb.co/pvn864CX/image.png", category: "Education" },
    { id: 6, name: "Solex Group", logo: "https://i.ibb.co/cKLM6TLR/solex.jpg", category: "Enginnering" },
    { id: 7, name: "Fits Retail", logo: "https://i.ibb.co/RTNXvLjB/fits.png", category: "Retail" },
    { id: 8, name: "GENXT", logo: "https://i.ibb.co/RmKtrf2/genxt.jpg", category: "Accessories" },
    { id: 9, name: "Candy Factory", logo: "https://i.ibb.co/84GHSY1H/cfactory.png", category: "Advertising" },
    { id: 10, name: "Transnational Lanka", logo: "https://i.ibb.co/gZzKDChF/transn.jpg", category: "Retail" },
    { id: 11, name: "BCAS Campus", logo: "https://i.ibb.co/NqKnHMr/bcas.png", category: "Education" },
    { id: 12, name: "DPR", logo: "https://i.ibb.co/NdcdmnmT/dpr.png", category: "Business Consultant" },
    { id: 13, name: "Anverally Tea", logo: "https://i.ibb.co/Xk6bw5xF/anverelytea.jpg", category: "Tea Manufacturing" },
    { id: 14, name: "Lalan Engineering", logo: "https://i.ibb.co/4g8wymL7/lalan.jpg", category: "Enginnering" },
    { id: 15, name: "TukTuk", logo: "https://i.ibb.co/wN6xNrsS/tuktuk.png", category: "Travel" },
    { id: 16, name: "Captial One", logo: "https://i.ibb.co/YTQTpfNW/capitalone.png", category: "Finance" },
    { id: 17, name: "LLP Rodrigo & Sons", logo: "https://i.ibb.co/YTLvKkC6/llp.jpg", category: "Plastic" },
    { id: 18, name: "Gajma", logo: "https://i.ibb.co/0R0VHqBx/gajma.jpg", category: "Tax Consultant" },
    { id: 19, name: "Lumala", logo: "https://i.ibb.co/prxYCMfx/LUMALA.jpg", category: "Bicycle" },
    { id: 20, name: "Trident Corporation", logo: "https://i.ibb.co/KxQR7zmT/trident.png", category: "IT" },
    { id: 21, name: "Transocean Duty Free", logo: "https://i.ibb.co/mFHfsjFg/Trans-Ocean.png", category: "Duty Free" },
    { id: 22, name: "Stalione Lanka", logo: "https://i.ibb.co/WWwpdM0p/stallion.jpg", category: "Business management" },
    { id: 23, name: "Prime Group", logo: "https://i.ibb.co/GvsdH7ms/primegroup.png", category: "Residencies" },
    { id: 24, name: "SriTrims Limited", logo: "https://i.ibb.co/v6zVsVwL/sritrims.png", category: "Garment Exporter" },
    { id: 25, name: "Antler Group", logo: "https://i.ibb.co/0pbkzPgj/antler.jpg", category: "Fabric" },
    { id: 26, name: "Markspens Labels", logo: "https://i.ibb.co/6cSTHQGv/MS.jpg", category: "Retail" },
    { id: 27, name: "Transco Holdings", logo: "https://i.ibb.co/8gWVLrdJ/logo.png", category: "Travel" },
    { id: 28, name: "Global Choice", logo: "https://i.ibb.co/hx9pksLZ/GBC.jpg", category: "BPO" },
    { id: 29, name: "Global Resources Pvt", logo: "https://i.ibb.co/Xrgq57gm/GR.png", category: "Retail" },
    { id: 30, name: "MAS Associates", logo: "https://i.ibb.co/8nHN7LJJ/mas.jpg", category: "Auditing" },
    { id: 31, name: "Empire Teas", logo: "https://i.ibb.co/N6fV9LcC/et.jpg", category: "Tea Manufacturing" },
    { id: 32, name: "Asia Capitals", logo: "https://i.ibb.co/tP2YTzzC/asia-capitals.png", category: "Finance" },
    { id: 33, name: "Dreamron", logo: "https://i.ibb.co/RTxgYkmf/dreamron.png", category: "FMCG Retail" },
    { id: 34, name: "Star Garments", logo: "https://i.ibb.co/WWpf8Z3Z/star.jpg", category: "Apparel" },
    { id: 35, name: "Maliban at Little Lion", logo: "https://i.ibb.co/bR1Dh5rY/littlelio-n.png", category: "Food & Beverage" },
    { id: 36, name: "Botanicoir Lanka", logo: "https://i.ibb.co/ynVfPdjL/botan.png", category: "Export" },
    { id: 37, name: "Rodrigi & Co", logo: "https://i.ibb.co/WNTSdTm4/rodrigo.jpg", category: "Auditing & Taxation" },
    { id: 38, name: "Puwakaramba", logo: "https://i.ibb.co/kV2pM92h/images.png", category: "Manufacturing" },
    { id: 39, name: "VSIS", logo: "https://i.ibb.co/B2tPJQxG/Vector-2048x975-jpg.webp", category: "IT" },
    { id: 40, name: "Poly Creations", logo: "https://i.ibb.co/qM17v1mr/pc.png", category: "Manufacturing" },
    { id: 41, name: "Torch Labs", logo: "https://i.ibb.co/YTVRDBnB/tll.jpg", category: "IT" },
    { id: 42, name: "Nexus Communication", logo: "https://i.ibb.co/kgKjGPQV/nexus.webp", category: "Tele Communication" },
    { id: 43, name: "Car Mart", logo: "https://i.ibb.co/jk9kDXD6/carmart.png", category: "Retail" },
    { id: 44, name: "High Life Online", logo: "https://i.ibb.co/23GM2qBX/higjlifr.png", category: "BPO" },
    { id: 45, name: "Lovikta", logo: "https://i.ibb.co/ymKPrZcz/Lovikta.png", category: "BPO" },
    { id: 46, name: "Cult Interior", logo: "https://i.ibb.co/9kjRx5Ht/cult.jpg", category: "Retail" },
    { id: 47, name: "SMT Apparels", logo: "https://i.ibb.co/BKydW4B1/smt.jpg", category: "Apparel" },
    { id: 48, name: "Travelco Holidays", logo: "https://i.ibb.co/Z18MVsnQ/travalco.webp", category: "Travel" },
    { id: 49, name: "Fairway Holdings", logo: "https://i.ibb.co/HpqxwxtJ/fairway.png", category: "Retail/Hospitality" },
    { id: 50, name: "Evolution Auto", logo: "https://i.ibb.co/G311wVfs/evauto.jpg", category: "Retail" },
    { id: 51, name: "Global Med", logo: "https://i.ibb.co/pvq5dNWh/glbmed.png", category: "Medical & Pharmaceutial" }


  ];
  
  // Duplicate partners array for smooth infinite scrolling
  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        
        {/* First row - Left to Right */}
        <div className="mb-8 relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-indigo-50 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-blue-50 to-transparent z-10"></div>
          
          <div 
            ref={leftScrollRef}
            className="flex overflow-x-hidden whitespace-nowrap py-4"
          >
            <div className="flex space-x-8 inline-block">
              {duplicatedPartners.map((partner, index) => (
                <div 
                  key={`left-${partner.id}-${index}`} 
                  className="bg-white p-6 rounded-lg shadow-md w-56 inline-block transform transition duration-500 hover:-translate-y-2 hover:shadow-xl group"
                >
                  <div className="mb-4 overflow-hidden rounded-md flex items-center justify-center h-20">
                    <img 
                      src={partner.logo} 
                      alt={partner.name} 
                      className="object-contain max-w-full max-h-full transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900">{partner.name}</h3>
                    <p className="text-sm text-indigo-600">{partner.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Second row - Right to Left */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-indigo-50 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-blue-50 to-transparent z-10"></div>
          
          <div 
            ref={rightScrollRef}
            className="flex overflow-x-hidden whitespace-nowrap py-4"
          >
            <div className="flex space-x-8 inline-block">
              {duplicatedPartners.reverse().map((partner, index) => (
                <div 
                  key={`right-${partner.id}-${index}`} 
                  className="bg-white p-6 rounded-lg shadow-md w-56 inline-block transform transition duration-500 hover:-translate-y-2 hover:shadow-xl group"
                >
                  <div className="mb-4 overflow-hidden rounded-md flex items-center justify-center h-20">
                    <img 
                      src={partner.logo} 
                      alt={partner.name} 
                      className="object-contain max-w-full max-h-full transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900">{partner.name}</h3>
                    <p className="text-sm text-indigo-600">{partner.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
       
      </div>
    </div>
  );
};

export default TPSection;