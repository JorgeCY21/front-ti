import { useVideos } from "../hooks/useVideos";
import { useUserVideos } from "../hooks/useUserVideos";
import { useRegisterUserVideo } from "../hooks/useRegisterUserVideo";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function VideosPage() {
  const { user } = useAuth();
  const { data: videos, isLoading, error } = useVideos();
  const { data: userVideos } = useUserVideos(user?.id || "");
  const { mutate: registerUserVideo } = useRegisterUserVideo();

  const alreadySeen = new Set(userVideos?.map((uv) => uv.video_id));

  const handleVideoClick = (videoId: number) => {
    if (!user?.id || alreadySeen.has(videoId)) return;
    registerUserVideo({ user_id: user.id, video_id: videoId });
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <Navbar />
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-400 rounded-full mb-4"></div>
          <p className="text-blue-800 text-lg font-medium">Cargando videos...</p>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <Navbar />
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="text-center p-6 bg-red-100 rounded-xl max-w-md">
          <p className="text-red-600 text-lg font-medium">Error al cargar los videos</p>
          <p className="text-red-500 mt-2">{error.message}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Videos Educativos</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explora nuestra colección de videos educativos y amplía tus conocimientos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos?.map((video) => {
            const isSeen = alreadySeen.has(video.id);
            const durationMin = Math.floor(video.duration_seg / 60);
            const durationSec = video.duration_seg % 60;

            return (
              <div
                key={video.id}
                onClick={() => handleVideoClick(video.id)}
                className={`group relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${
                  isSeen ? "ring-2 ring-green-400" : "hover:shadow-xl"
                }`}
              >
                {isSeen && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    Visto
                  </div>
                )}
                
                <div className="relative aspect-video bg-gray-200 overflow-hidden">
                  <iframe
                    className="w-full h-full object-cover"
                    src={video.url.replace("watch?v=", "embed/")}
                    title={video.title}
                    allowFullScreen
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {durationMin}:{durationSec.toString().padStart(2, '0')}
                  </div>
                </div>
                
                <div className={`p-5 ${isSeen ? "bg-green-50" : "bg-white"}`}>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${
                      isSeen ? "text-green-600 font-medium" : "text-gray-500"
                    }`}>
                      {isSeen ? "Completado" : "Nuevo"}
                    </span>
                    <button 
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isSeen 
                          ? "bg-green-100 text-green-700" 
                          : "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                      } transition-colors`}
                    >
                      {isSeen ? "✓" : "Ver"}
                    </button>
                  </div>
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