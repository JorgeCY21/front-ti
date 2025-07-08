import Navbar from "../components/Navbar";

function VideosPage() {
  return (
    <div className="main">
      <Navbar />
      <div className="mx-6 flex flex-wrap py-6 gap-4">
        {/* Columna 1: Lista de videos */}
        <div className="w-full md:w-1/2 space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Videos educativos</h2>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <iframe
              className="w-full h-56"
              src="https://www.youtube.com/embed/l6r6Zy5sJ6c"
              title="Video 1"
              frameBorder="0"
              allowFullScreen
            />
            <div className="p-4 text-gray-900">
              <h3 className="font-semibold text-lg">Cómo reducir tu consumo eléctrico</h3>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <iframe
              className="w-full h-56"
              src="https://www.youtube.com/embed/sTLnK4G5NKM"
              title="Video 2"
              frameBorder="0"
              allowFullScreen
            />
            <div className="p-4 text-gray-900">
              <h3 className="font-semibold text-lg">Consejos para ahorrar energía</h3>
            </div>
          </div>
        </div>

        {/* Columna 2: Texto adicional u otros recursos */}
        <div className="w-full md:w-1/2 text-white">
          <h3 className="text-xl font-semibold mb-4">¿Por qué es importante informarte?</h3>
          <p className="mb-4">
            Aprender sobre tu consumo energético te permite tomar decisiones más conscientes
            y sostenibles. Estos videos te ayudarán a identificar oportunidades de ahorro
            en tu hogar y a entender mejor tu recibo de luz.
          </p>
          <p>
            La educación energética es el primer paso hacia un futuro más limpio y eficiente. 💡
          </p>
        </div>
      </div>
    </div>
  );
}

export default VideosPage;
