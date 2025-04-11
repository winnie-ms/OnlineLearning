"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ videoId, onError, title, autoplay = false }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    if (!videoId) {
      setHasError(true);
      onError?.("No video ID provided");
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [videoId, onError]);

  if (hasError) {
    return (
      <div className="w-full bg-white rounded-lg p-4">
        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-exclamation-circle text-2xl text-gray-400 mb-2"></i>
            <p className="text-gray-700 font-inter">Failed to load video</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg">
      {title && (
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="font-inter text-lg font-medium text-gray-800">{title}</h3>
        </div>
      )}
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#357AFF] rounded-full animate-spin"></div>
          </div>
        )}
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?controls=${showControls ? 1 : 0}&autoplay=${autoplay ? 1 : 0}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="px-4 py-3">
        <button
          onClick={() => setShowControls(!showControls)}
          className="text-sm text-gray-600 hover:text-[#357AFF] transition-colors"
        >
          <i className={`fas fa-${showControls ? 'eye-slash' : 'eye'} mr-2`}></i>
          {showControls ? 'Hide' : 'Show'} controls
        </button>
      </div>
    </div>
  );
}

function StoryComponent() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4 font-inter text-gray-900">Basic Video Player</h2>
        <MainComponent
          videoId="dQw4w9WgXcQ"
          title="Never Gonna Give You Up"
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 font-inter text-gray-900">Autoplay Video</h2>
        <MainComponent
          videoId="dQw4w9WgXcQ"
          autoplay={true}
          title="Autoplay Example"
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 font-inter text-gray-900">Error State</h2>
        <MainComponent
          videoId=""
          title="Invalid Video"
          onError={(error) => console.error(error)}
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 font-inter text-gray-900">Without Title</h2>
        <MainComponent
          videoId="dQw4w9WgXcQ"
        />
      </div>
    </div>
  );
});
}