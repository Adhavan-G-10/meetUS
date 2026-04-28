import React from 'react';

export const VideoWindow = ({
  localVideoRef,
  remoteVideoRef,
  videoEnabled,
  audioEnabled,
  connectionStatus,
  error,
  onToggleVideo,
  onToggleAudio,
}) => {
  return (
    <div className="relative w-full h-full bg-black rounded-xl overflow-hidden flex-1 min-h-0">
      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="text-center">
            <p className="text-red-400 font-semibold mb-2">⚠️ Video Error</p>
            <p className="text-gray-300 text-sm max-w-xs">{error}</p>
            <p className="text-gray-400 text-xs mt-2">Text chat is still available</p>
          </div>
        </div>
      )}

      {/* Remote video (main) */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
        style={{ transform: 'scaleX(-1)' }}
      />

      {/* Connection status overlay */}
      {connectionStatus !== 'connected' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-40">
          <div className="text-center">
            {connectionStatus === 'connecting' && (
              <>
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3" />
                <p className="text-white font-medium">Connecting video...</p>
              </>
            )}
            {connectionStatus === 'failed' && (
              <>
                <p className="text-red-400 font-semibold mb-2">Connection Failed</p>
                <p className="text-gray-300 text-sm">Could not establish video connection</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Local video (PIP) */}
      <div className="absolute bottom-4 right-4 w-24 h-32 md:w-32 md:h-40 rounded-lg overflow-hidden bg-black border-2 border-white/20 shadow-lg">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />
        {!videoEnabled && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <span className="text-white text-xs font-medium">Camera Off</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
        {/* Mute Audio */}
        <button
          onClick={onToggleAudio}
          className={`p-3 rounded-full transition-all duration-200 ${
            audioEnabled
              ? 'bg-white/20 hover:bg-white/30 text-white'
              : 'bg-red-600/80 hover:bg-red-700 text-white'
          }`}
          title={audioEnabled ? 'Mute audio' : 'Unmute audio'}
        >
          {audioEnabled ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
            </svg>
          )}
        </button>

        {/* Toggle Video */}
        <button
          onClick={onToggleVideo}
          className={`p-3 rounded-full transition-all duration-200 ${
            videoEnabled
              ? 'bg-white/20 hover:bg-white/30 text-white'
              : 'bg-red-600/80 hover:bg-red-700 text-white'
          }`}
          title={videoEnabled ? 'Turn camera off' : 'Turn camera on'}
        >
          {videoEnabled ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-11-7l2.03 2.71L16 10h4v6h-4l-2.07 2.71z" />
            </svg>
          )}
        </button>
      </div>

      {/* Connection status badge */}
      <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm z-20">
        {connectionStatus === 'connected' ? (
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Connected
          </span>
        ) : connectionStatus === 'connecting' ? (
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            Connecting...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-400 rounded-full" />
            Disconnected
          </span>
        )}
      </div>
    </div>
  );
};
