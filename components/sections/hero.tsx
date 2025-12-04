"use client";

export default function Hero() {
  return (
    <div className="relative w-full h-[50vh] md:h-screen overflow-hidden bg-[#050507]">
      <video
        autoPlay
        className="absolute inset-0 w-full h-full object-contain md:object-cover"
        controlsList="nodownload"
        loop
        playsInline
        muted
      >
        <source src="https://alabaster-demo.s3.us-east-1.amazonaws.com/mutuals+video.mov" type="video/mp4" />
      </video>
      {/* Optional gradient overlay for better text readability if needed later */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050507]/40" />
    </div>
  );
}
