import { useVideos } from "../hooks/useVideos";
import { useUserVideos } from "../hooks/useUserVideos";
import { useRegisterUserVideo } from "../hooks/useRegisterUserVideo";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function VideosPage() {
  const { user } = useAuth(); // Asegúrate de tener user.id
  const { data: videos, isLoading, error } = useVideos();
  const { data: userVideos } = useUserVideos(user?.id || "");
  const { mutate: registerUserVideo } = useRegisterUserVideo();

  const alreadySeen = new Set(userVideos?.map((uv) => uv.video_id));

  const handleVideoClick = (videoId: number) => {
    if (!user?.id || alreadySeen.has(videoId)) return;
    registerUserVideo({ user_id: user.id, video_id: videoId });
  };

  if (isLoading)
    return <p className="text-white text-center mt-6">Cargando videos...</p>;
  if (error)
    return <p className="text-red-400 text-center mt-6">Error al cargar videos.</p>;

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <div className="px-6 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Videos Educativos</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos?.map((video) => {
            const isSeen = alreadySeen.has(video.id);

            return (
              <div
                key={video.id}
                className={`rounded-lg overflow-hidden shadow-md text-black transition duration-300 cursor-pointer border-2 ${
                  isSeen
                    ? "border-green-500 bg-green-50"
                    : "border-transparent bg-white hover:scale-[1.02]"
                }`}
                onClick={() => handleVideoClick(video.id)}
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
                    Duración: {Math.floor(video.duration_seg / 60)} min{" "}
                    {video.duration_seg % 60} seg
                  </p>
                  {isSeen && (
                    <span className="text-green-600 text-sm font-medium">✓ Visto</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default VideosPage;
