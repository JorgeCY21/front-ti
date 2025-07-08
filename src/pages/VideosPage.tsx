import { useVideos } from "../hooks/useVideos";
import Navbar from "../components/Navbar";

function VideosPage() {
  const { data: videos, isLoading, error } = useVideos();

  if (isLoading) return <p className="text-white text-center mt-6">Cargando videos...</p>;
  if (error) return <p className="text-red-400 text-center mt-6">Error al cargar videos.</p>;

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <div className="px-6 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Videos Educativos</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos?.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-lg overflow-hidden shadow-md text-black transition hover:scale-[1.02] duration-300"
            >
              <iframe
                className="w-full h-64"
                src={video.url.replace("watch?v=", "embed/")}
                title={video.title}
                allowFullScreen
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{video.title}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Duración: {Math.floor(video.duration_seg / 60)} min {video.duration_seg % 60} seg
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VideosPage;
