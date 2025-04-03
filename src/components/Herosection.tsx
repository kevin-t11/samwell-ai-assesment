'use client';

const HeroSection = () => {
  return (
    <div className="text-center mb-2">
      <h1 className="text-5xl md:text-6xl font-bold mb-4">
        <span className="bg-gradient-to-r from-blue-500 via-green-500 to-blue-400 text-transparent bg-clip-text">
          Personalized
        </span>
        <span className="text-gray-900"> Learning</span>
      </h1>
      <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
        with Samwell.ai
      </h2>
      <p className="text-xl text-gray-600">
        Explore how Samwell can help you learn what you need, effortlessly.
      </p>
    </div>
  );
};

export default HeroSection;