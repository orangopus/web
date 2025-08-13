<template>
  <div class="globe-container">
    <div class="globe-header">
      <h1>Earth Data Globe</h1>
      <p>Explore real-time data from around the world</p>
    </div>
    
    <div class="globe-controls">
      <div class="data-selector">
        <label for="dataType">Data Type:</label>
        <select id="dataType" v-model="selectedDataType" @change="loadData">
          <option value="earthquakes">Earthquakes</option>
          <option value="volcanoes">Volcanoes</option>
          <option value="weather">Weather Stations</option>
          <option value="satellites">Satellites</option>
          <option value="airports">Airports</option>
        </select>
      </div>
      
      <div class="view-controls">
        <button @click="resetView" class="control-btn">Reset View</button>
        <button @click="toggleAutoRotate" class="control-btn">
          {{ autoRotate ? 'Stop Rotation' : 'Start Rotation' }}
        </button>
      </div>
    </div>
    
    <div class="globe-viewer">
      <canvas ref="globeCanvas" class="globe-canvas"></canvas>
      <div class="globe-overlay">
        <div class="globe-info">
          <div class="globe-title">Earth</div>
          <div class="globe-subtitle">Interactive Data Visualization</div>
        </div>
      </div>
    </div>
    
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Loading data...</p>
    </div>
    
    <div class="data-info" v-if="currentData.length > 0">
      <h3>Data Points: {{ currentData.length }}</h3>
      <div class="data-list">
        <div v-for="(point, index) in currentData.slice(0, 5)" :key="index" class="data-point">
          <span class="point-name">{{ point.name || `Point ${index + 1}` }}</span>
          <span class="point-coords">{{ point.lat.toFixed(2) }}, {{ point.lng.toFixed(2) }}</span>
        </div>
        <div v-if="currentData.length > 5" class="more-points">
          +{{ currentData.length - 5 }} more points
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Globe',
  data() {
    return {
      selectedDataType: 'earthquakes',
      currentData: [],
      autoRotate: true,
      isLoading: false,
      canvas: null,
      ctx: null,
      animationId: null,
      rotation: 0,
      mouseX: 0,
      mouseY: 0,
      isDragging: false,
      lastMouseX: 0,
      lastMouseY: 0
    }
  },
  mounted() {
    this.initCanvas()
    this.loadData()
    this.startAnimation()
    this.addEventListeners()
  },
  beforeDestroy() {
    this.stopAnimation()
    this.removeEventListeners()
  },
  methods: {
    initCanvas() {
      this.canvas = this.$refs.globeCanvas
      this.ctx = this.canvas.getContext('2d')
      this.resizeCanvas()
    },
    
    resizeCanvas() {
      const container = this.canvas.parentElement
      this.canvas.width = container.clientWidth
      this.canvas.height = container.clientHeight
    },
    
    addEventListeners() {
      this.canvas.addEventListener('mousedown', this.onMouseDown)
      this.canvas.addEventListener('mousemove', this.onMouseMove)
      this.canvas.addEventListener('mouseup', this.onMouseUp)
      this.canvas.addEventListener('wheel', this.onWheel)
      window.addEventListener('resize', this.resizeCanvas)
    },
    
    removeEventListeners() {
      this.canvas.removeEventListener('mousedown', this.onMouseDown)
      this.canvas.removeEventListener('mousemove', this.onMouseMove)
      this.canvas.removeEventListener('mouseup', this.onMouseUp)
      this.canvas.removeEventListener('wheel', this.onWheel)
      window.removeEventListener('resize', this.resizeCanvas)
    },
    
    onMouseDown(e) {
      this.isDragging = true
      this.lastMouseX = e.clientX
      this.lastMouseY = e.clientY
    },
    
    onMouseMove(e) {
      if (this.isDragging) {
        const deltaX = e.clientX - this.lastMouseX
        const deltaY = e.clientY - this.lastMouseY
        
        this.rotation += deltaX * 0.01
        this.lastMouseX = e.clientX
        this.lastMouseY = e.clientY
      }
    },
    
    onMouseUp() {
      this.isDragging = false
    },
    
    onWheel(e) {
      e.preventDefault()
      // Add zoom functionality here if needed
    },
    
    startAnimation() {
      const animate = () => {
        this.draw()
        this.animationId = requestAnimationFrame(animate)
      }
      animate()
    },
    
    stopAnimation() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId)
      }
    },
    
    draw() {
      const { width, height } = this.canvas
      this.ctx.clearRect(0, 0, width, height)
      
      // Draw background
      const gradient = this.ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2)
      gradient.addColorStop(0, '#1e3c72')
      gradient.addColorStop(1, '#2a5298')
      this.ctx.fillStyle = gradient
      this.ctx.fillRect(0, 0, width, height)
      
      // Draw globe
      this.drawGlobe()
      
      // Draw data points
      this.drawDataPoints()
    },
    
    drawGlobe() {
      const { width, height } = this.canvas
      const centerX = width / 2
      const centerY = height / 2
      const radius = Math.min(width, height) * 0.3
      
      // Draw globe outline
      this.ctx.beginPath()
      this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      this.ctx.strokeStyle = '#4CAF50'
      this.ctx.lineWidth = 3
      this.ctx.stroke()
      
      // Draw graticule lines
      this.ctx.strokeStyle = 'rgba(255,255,255,0.3)'
      this.ctx.lineWidth = 1
      
      // Latitude lines
      for (let lat = -80; lat <= 80; lat += 20) {
        const y = centerY + (lat / 90) * radius
        if (y > 0 && y < height) {
          this.ctx.beginPath()
          this.ctx.moveTo(centerX - radius, y)
          this.ctx.lineTo(centerX + radius, y)
          this.ctx.stroke()
        }
      }
      
      // Longitude lines
      for (let lng = -180; lng <= 180; lng += 30) {
        const x = centerX + Math.cos((lng + this.rotation) * Math.PI / 180) * radius
        const y = centerY + Math.sin((lng + this.rotation) * Math.PI / 180) * radius
        this.ctx.beginPath()
        this.ctx.moveTo(centerX, centerY)
        this.ctx.lineTo(x, y)
        this.ctx.stroke()
      }
      
      // Auto-rotate
      if (this.autoRotate) {
        this.rotation += 0.5
      }
    },
    
    drawDataPoints() {
      if (!this.currentData.length) return
      
      const { width, height } = this.canvas
      const centerX = width / 2
      const centerY = height / 2
      const radius = Math.min(width, height) * 0.3
      
      this.currentData.forEach(point => {
        const x = centerX + Math.cos((point.lng + this.rotation) * Math.PI / 180) * 
                  Math.cos(point.lat * Math.PI / 180) * radius
        const y = centerY + Math.sin(point.lat * Math.PI / 180) * radius
        
        // Only draw points that are visible (not behind the globe)
        if (y > centerY - radius && y < centerY + radius) {
          this.ctx.beginPath()
          this.ctx.arc(x, y, 4, 0, 2 * Math.PI)
          this.ctx.fillStyle = '#ff4444'
          this.ctx.fill()
          this.ctx.strokeStyle = '#fff'
          this.ctx.lineWidth = 1
          this.ctx.stroke()
        }
      })
    },
    
    async loadData() {
      this.isLoading = true
      this.currentData = []
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Sample data
        const sampleData = {
          earthquakes: [
            { lat: 36.2048, lng: 138.2529, name: 'Japan Earthquake' },
            { lat: 40.7128, lng: -74.0060, name: 'New York Quake' },
            { lat: 34.0522, lng: -118.2437, name: 'LA Earthquake' },
            { lat: 51.5074, lng: -0.1278, name: 'London Quake' },
            { lat: -33.8688, lng: 151.2093, name: 'Sydney Quake' }
          ],
          volcanoes: [
            { lat: 19.4211, lng: -155.2871, name: 'Kilauea' },
            { lat: 40.8225, lng: 14.4289, name: 'Mount Vesuvius' },
            { lat: 35.3606, lng: 138.7274, name: 'Mount Fuji' },
            { lat: -1.2921, lng: 36.8219, name: 'Mount Kenya' },
            { lat: 64.9631, lng: -19.0208, name: 'Eyjafjallajökull' }
          ],
          weather: [
            { lat: 40.7128, lng: -74.0060, name: 'NYC Weather' },
            { lat: 51.5074, lng: -0.1278, name: 'London Weather' },
            { lat: 35.6762, lng: 139.6503, name: 'Tokyo Weather' },
            { lat: -33.8688, lng: 151.2093, name: 'Sydney Weather' },
            { lat: 55.7558, lng: 37.6176, name: 'Moscow Weather' }
          ],
          satellites: [
            { lat: 0, lng: 0, name: 'ISS' },
            { lat: 20, lng: 45, name: 'GPS Satellite' },
            { lat: -30, lng: 120, name: 'Weather Sat' },
            { lat: 60, lng: -90, name: 'Comm Sat' },
            { lat: -45, lng: 180, name: 'Research Sat' }
          ],
          airports: [
            { lat: 40.6413, lng: -73.7781, name: 'JFK Airport' },
            { lat: 51.4700, lng: -0.4543, name: 'Heathrow' },
            { lat: 35.6762, lng: 139.6503, name: 'Haneda Airport' },
            { lat: -33.9399, lng: 151.1753, name: 'Sydney Airport' },
            { lat: 55.6304, lng: 12.6508, name: 'Copenhagen Airport' }
          ]
        }
        
        this.currentData = sampleData[this.selectedDataType] || []
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        this.isLoading = false
      }
    },
    
    resetView() {
      this.rotation = 0
    },
    
    toggleAutoRotate() {
      this.autoRotate = !this.autoRotate
    }
  }
}
</script>

<style scoped>
.globe-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.globe-header {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.globe-header h1 {
  margin: 0 0 8px 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.globe-header p {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.globe-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  gap: 20px;
  align-items: center;
}

.data-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
}

.data-selector label {
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

.data-selector select {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: rgba(255,255,255,0.9);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.data-selector select:hover {
  background: rgba(255,255,255,1);
  transform: translateY(-1px);
}

.view-controls {
  display: flex;
  gap: 10px;
}

.control-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: rgba(255,255,255,0.9);
  color: #333;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.control-btn:hover {
  background: rgba(255,255,255,1);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.globe-viewer {
  flex: 1;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.globe-canvas {
  width: 100%;
  height: 100%;
  cursor: grab;
}

.globe-canvas:active {
  cursor: grabbing;
}

.globe-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 100;
  pointer-events: none;
}

.globe-title {
  font-size: 3rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  margin-bottom: 10px;
}

.globe-subtitle {
  font-size: 1.2rem;
  opacity: 0.8;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

.loading-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  z-index: 2000;
  backdrop-filter: blur(10px);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255,255,255,0.3);
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.data-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 20px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  max-width: 300px;
  z-index: 1000;
}

.data-info h3 {
  margin: 0 0 15px 0;
  font-size: 1.2rem;
  color: #4CAF50;
}

.data-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.data-point {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.data-point:last-child {
  border-bottom: none;
}

.point-name {
  font-weight: 600;
  color: #4CAF50;
}

.point-coords {
  font-size: 0.9rem;
  opacity: 0.8;
}

.more-points {
  text-align: center;
  padding: 8px 0;
  font-style: italic;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .globe-header h1 {
    font-size: 1.8rem;
  }
  
  .globe-header p {
    font-size: 1rem;
  }
  
  .globe-controls {
    flex-direction: column;
    gap: 10px;
  }
  
  .data-info {
    max-width: 250px;
  }
  
  .globe-title {
    font-size: 2rem;
  }
}
</style> 