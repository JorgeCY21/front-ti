import { Link } from "react-router-dom";
import heroImage from "../../public/home_img.png";

function HomeComponent(){
  return (
    <section className="bg-gradient-to-l from-white via-[#f5fffe] to-[#dffdfb] font-[Poppins] py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900">
            Experimenta una nueva forma de{" "}
            <span className="text-[#13ada0]">
              gestionar tu consumo eléctrico
            </span>
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            Recibe reportes personalizados, analiza tu consumo diario y consulta a nuestro bot para tomar decisiones más inteligentes y ahorrar energía.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link
              to="/register"
              className="bg-[#13ada0] text-white px-6 py-3 rounded-md text-lg hover:bg-[#0e8d82] transition"
            >
              Empezar ahora
            </Link>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={heroImage}
            alt="Persona usando el móvil"
            className="max-h-[550px] rounded-lg w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default HomeComponent;

