'use client';

import Image from "next/image";

const SocialProof = () => {
  return (
    <div className="text-center my-8">
      <p className="text-lg text-gray-700 font-medium mb-5">
        Loved by over 3 million Students and Academics across the world
      </p>
      <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
        <Image
          src="/Logo_of_the_United_Nations 2.svg"
          alt="United Nations"
          width={96}
          height={48}
          className="h-12 object-contain"
        />
        <Image
          src="/university_of_toronto.svg"
          alt="University of Toronto"
          width={96}
          height={48}
          className="h-12 object-contain"
        />

        <Image
          src="/london_school_of_economics.svg"
          alt="London School of Economics"
          width={96}
          height={48}
          className="h-12 object-contain"
        />
        <Image
          src="/university_bocconi.svg"
          alt="University Bocconi"
          width={96}
          height={48}
          className="h-12 object-contain"
        />
      </div>
    </div>
  );
};

export default SocialProof;