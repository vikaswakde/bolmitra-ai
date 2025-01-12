import { BrainIcon, MoveRightIcon } from "lucide-react";

const HowItWorks = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="flex items-center justify-center w-full pb-6 pt-3">
        <h2 className="uppercase font-bold text-xl mb-8 text-purple-600">
          How It Works
        </h2>
      </div>
      <h3 className="font-semibold flex items-center justify-center mb-24 text-center">
        Transform raw audio into personalized intelligence and actionable
        feedback.
      </h3>
      <div className="flex items-center justify-center gap-4 lg:gap-24">
        <div className="flex flex-col gap-4 items-center justify-center ">
          <p className="text-7xl scale-x-[-1]">🎤</p>
          <p className="text-center font-medium">Record Your Audio</p>
        </div>
        <MoveRightIcon
          size={64}
          strokeWidth={0.5}
          className="text-purple-500"
        />
        <div className="flex flex-col gap-4 items-center justify-center">
          <p className="flex items-center justify-center">
            <BrainIcon size={64} strokeWidth={0.5} />
          </p>
          <p className="text-center font-medium">AI-Powered Analysis ✨</p>
        </div>
        <MoveRightIcon
          size={64}
          strokeWidth={0.5}
          className="text-purple-500"
        />
        <div className="flex flex-col gap-4 items-center justify-center">
          <p className="text-7xl scale-x-[-1]">📊</p>
          <p className="text-center font-medium">Receive Detailed Feedback</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
