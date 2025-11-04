'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [animationFrames, setAnimationFrames] = useState<string[]>([])
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [settings, setSettings] = useState({
    frameCount: 8,
    motionIntensity: 50,
    effect: 'pan-zoom'
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
        setAnimationFrames([])
      }
      reader.readAsDataURL(file)
    }
  }

  const generateAnimation = async () => {
    if (!uploadedImage) return

    setIsProcessing(true)
    try {
      const response = await fetch('/api/generate-anime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: uploadedImage,
          settings,
        }),
      })

      const data = await response.json()
      setAnimationFrames(data.frames)
      setCurrentFrame(0)
      setIsPlaying(true)
    } catch (error) {
      console.error('Error generating animation:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Animation playback
  if (isPlaying && animationFrames.length > 0) {
    setTimeout(() => {
      setCurrentFrame((prev) => (prev + 1) % animationFrames.length)
    }, 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            Manga to Anime AI
          </h1>
          <p className="text-gray-300 text-lg">
            Transform static manga panels into animated sequences
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
          >
            <h2 className="text-2xl font-bold mb-4 text-purple-400">Upload Manga Panel</h2>

            <div className="mb-6">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-purple-500/50 rounded-xl cursor-pointer hover:border-purple-400 transition-colors">
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Uploaded manga"
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <svg className="w-16 h-16 mb-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-lg text-gray-300">Click to upload manga page</p>
                    <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Animation Effect</label>
                <select
                  className="w-full bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-400"
                  value={settings.effect}
                  onChange={(e) => setSettings({ ...settings, effect: e.target.value })}
                >
                  <option value="pan-zoom">Pan & Zoom</option>
                  <option value="parallax">Parallax Layers</option>
                  <option value="motion-blur">Motion Blur</option>
                  <option value="character-animate">Character Animation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Frame Count: {settings.frameCount}
                </label>
                <input
                  type="range"
                  min="4"
                  max="16"
                  value={settings.frameCount}
                  onChange={(e) => setSettings({ ...settings, frameCount: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Motion Intensity: {settings.motionIntensity}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={settings.motionIntensity}
                  onChange={(e) => setSettings({ ...settings, motionIntensity: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateAnimation}
              disabled={!uploadedImage || isProcessing}
              className="w-full mt-6 bg-gradient-to-r from-pink-500 to-violet-500 text-white font-bold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Animation...
                </span>
              ) : (
                '✨ Generate Anime Animation'
              )}
            </motion.button>
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
          >
            <h2 className="text-2xl font-bold mb-4 text-purple-400">Animation Preview</h2>

            <div className="bg-black rounded-xl overflow-hidden mb-4 aspect-video flex items-center justify-center">
              <AnimatePresence mode="wait">
                {animationFrames.length > 0 ? (
                  <motion.img
                    key={currentFrame}
                    src={animationFrames[currentFrame]}
                    alt={`Frame ${currentFrame}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.05 }}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-gray-500 text-center">
                    <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>Your animation will appear here</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {animationFrames.length > 0 && (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    {isPlaying ? '⏸ Pause' : '▶ Play'}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setCurrentFrame(0)
                      setIsPlaying(false)
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    ⏮ Reset
                  </motion.button>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Frame {currentFrame + 1} of {animationFrames.length}</span>
                    <span>{settings.effect}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-violet-500 h-2 rounded-full transition-all"
                      style={{ width: `${((currentFrame + 1) / animationFrames.length) * 100}%` }}
                    />
                  </div>
                </div>

                <motion.a
                  href={`/api/download?frames=${encodeURIComponent(JSON.stringify(animationFrames))}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="block text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  💾 Download Animation
                </motion.a>
              </div>
            )}
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid md:grid-cols-4 gap-6 max-w-6xl mx-auto"
        >
          {[
            { icon: '🎨', title: 'AI-Powered', desc: 'Advanced algorithms analyze manga panels' },
            { icon: '⚡', title: 'Fast Generation', desc: 'Create animations in seconds' },
            { icon: '🎬', title: 'Multiple Effects', desc: 'Pan, zoom, parallax & more' },
            { icon: '📥', title: 'Easy Export', desc: 'Download as GIF or video' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 text-center"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
