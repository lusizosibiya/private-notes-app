import backgroundImage from "../../assets/images/bg-image.png";
import WelcomeSection from "./WelcomeSection";
import Register from "../../pages/Register";

function AuthLayout({ form = <Register /> }) {
  return (
    <main
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
      }}
    >
      <div className="mx-auto flex min-h-screen w-full flex-col lg:max-w-7xl lg:flex-row">
        <WelcomeSection />
        {form}
      </div>
    </main>
  );
}

export default AuthLayout;
