import { FiCloud, FiLock, FiStar } from "react-icons/fi";
import Logo from "../../assets/images/vellum-logo.png";

const benefits = [
  {
    Icon: FiLock,
    title: "Your notes, your space",
    description: "Only you can access your notes.",
  },
  {
    Icon: FiCloud,
    title: "Save anywhere",
    description: "Access your notes on any device.",
  },
  {
    Icon: FiStar,
    title: "Simple & focused",
    description: "A clean space to think and write.",
  },
];

function WelcomeSection() {
  return (
    <section className="flex min-h-screen w-full items-center px-7 py-12 sm:px-12 lg:w-1/2 lg:px-12 xl:px-16">
      <div className="w-full max-w-2xl text-[#E9E8E8]">
        <header className="mb-11">
          <img
            src={Logo}
            alt="Vellum"
            className="h-14 w-auto max-w-64 object-contain object-left sm:h-16"
          />
          <div className="mt-5 h-px w-16 bg-[#E9E8E8]/80" />
        </header>

        <div className="mb-11">
          <h1 className="font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl md:text-5xl xl:text-6xl">
            Capture
            <br />
            Your <span className="font-splash font-normal">Thoughts</span>
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-[1.5] text-[#E9E8E8] sm:text-base lg:text-lg">
            A secure and private space for your ideas, plans, and everything in
            between.
          </p>
        </div>

        <ul className="space-y-6 sm:space-y-7">
          {benefits.map(({ Icon, title, description }) => (
            <li key={title} className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#8E3435]/90 sm:h-16 sm:w-16">
                <Icon
                  aria-hidden="true"
                  className="h-6 w-6 text-[#E9E8E8] sm:h-7 sm:w-7"
                />
              </span>
              <div>
                <h2 className="text-base font-semibold sm:text-lg">{title}</h2>
                <p className="mt-1 text-sm leading-snug text-[#E9E8E8] sm:text-base">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default WelcomeSection;
