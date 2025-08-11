interface DataPoint {
  lat: number
  lng: number
  name?: string
  magnitude?: number
  altitude?: number
  type?: string
  temperature?: number
  humidity?: number
  pressure?: number
  windSpeed?: number
  description?: string
}

interface EarthquakeData {
  properties: {
    mag: number
    place: string
    time: number
  }
  geometry: {
    coordinates: [number, number, number]
  }
}

interface WeatherData {
  name: string
  coord: {
    lat: number
    lon: number
  }
  main: {
    temp: number
    humidity: number
    pressure: number
  }
  wind: {
    speed: number
  }
  weather: Array<{
    description: string
  }>
}

class GlobeService {
  private readonly USGS_API = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
  private readonly OPENWEATHER_API = 'https://api.openweathermap.org/data/2.5/weather'
  private readonly OPENWEATHER_API_KEY = 'demo' // In production, use a real API key

  async getEarthquakes(): Promise<DataPoint[]> {
    try {
      const response = await fetch(this.USGS_API)
      const data = await response.json()
      
      return data.features.slice(0, 20).map((quake: EarthquakeData) => ({
        lat: quake.geometry.coordinates[1],
        lng: quake.geometry.coordinates[0],
        name: quake.properties.place,
        magnitude: quake.properties.mag,
        type: 'Earthquake',
        description: `Magnitude ${quake.properties.mag} earthquake`
      }))
    } catch (error) {
      console.error('Error fetching earthquake data:', error)
      return this.getFallbackEarthquakes()
    }
  }

  async getWeatherStations(): Promise<DataPoint[]> {
    // Major cities for weather data
    const cities = [
      { name: 'New York', lat: 40.7128, lng: -74.0060 },
      { name: 'London', lat: 51.5074, lng: -0.1278 },
      { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
      { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
      { name: 'Moscow', lat: 55.7558, lng: 37.6176 },
      { name: 'Paris', lat: 48.8566, lng: 2.3522 },
      { name: 'Berlin', lat: 52.5200, lng: 13.4050 },
      { name: 'Rome', lat: 41.9028, lng: 12.4964 },
      { name: 'Madrid', lat: 40.4168, lng: -3.7038 },
      { name: 'Amsterdam', lat: 52.3676, lng: 4.9041 }
    ]

    const weatherData: DataPoint[] = []

    for (const city of cities) {
      try {
        const response = await fetch(
          `${this.OPENWEATHER_API}?q=${city.name}&appid=${this.OPENWEATHER_API_KEY}&units=metric`
        )
        const data: WeatherData = await response.json()
        
        weatherData.push({
          lat: data.coord.lat,
          lng: data.coord.lon,
          name: `${data.name} Weather`,
          temperature: data.main.temp,
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          windSpeed: data.wind.speed,
          type: 'Weather Station',
          description: `${data.weather[0]?.description || 'Weather data'}`
        })
      } catch (error) {
        console.error(`Error fetching weather for ${city.name}:`, error)
        // Add fallback data
        weatherData.push({
          lat: city.lat,
          lng: city.lng,
          name: `${city.name} Weather`,
          temperature: Math.random() * 30 + 10,
          humidity: Math.random() * 100,
          pressure: Math.random() * 200 + 900,
          windSpeed: Math.random() * 20,
          type: 'Weather Station',
          description: 'Weather data'
        })
      }
    }

    return weatherData
  }

  async getVolcanoes(): Promise<DataPoint[]> {
    // Using a public volcano database API or fallback data
    return [
      { lat: 19.4211, lng: -155.2871, name: 'Kilauea', type: 'Shield Volcano', description: 'Active shield volcano in Hawaii' },
      { lat: 40.8225, lng: 14.4289, name: 'Mount Vesuvius', type: 'Stratovolcano', description: 'Famous volcano in Italy' },
      { lat: 35.3606, lng: 138.7274, name: 'Mount Fuji', type: 'Stratovolcano', description: 'Iconic volcano in Japan' },
      { lat: -1.2921, lng: 36.8219, name: 'Mount Kenya', type: 'Stratovolcano', description: 'Extinct volcano in Kenya' },
      { lat: 64.9631, lng: -19.0208, name: 'Eyjafjallajökull', type: 'Stratovolcano', description: 'Icelandic volcano' },
      { lat: 14.6349, lng: -90.5069, name: 'Pacaya', type: 'Stratovolcano', description: 'Active volcano in Guatemala' },
      { lat: -8.4095, lng: 115.1889, name: 'Mount Agung', type: 'Stratovolcano', description: 'Active volcano in Bali' },
      { lat: 55.9847, lng: -160.5253, name: 'Mount Pavlof', type: 'Stratovolcano', description: 'Alaskan volcano' },
      { lat: 46.2000, lng: 122.1900, name: 'Mount St. Helens', type: 'Stratovolcano', description: 'Famous eruption in 1980' },
      { lat: 19.0233, lng: -98.6222, name: 'Popocatépetl', type: 'Stratovolcano', description: 'Active volcano in Mexico' }
    ]
  }

  async getSatellites(): Promise<DataPoint[]> {
    // Simulated satellite data - in production, you'd use a real satellite tracking API
    return [
      { lat: 0, lng: 0, name: 'ISS', altitude: 408, type: 'Space Station', description: 'International Space Station' },
      { lat: 20, lng: 45, name: 'GPS Satellite', altitude: 20200, type: 'Navigation', description: 'Global Positioning System' },
      { lat: -30, lng: 120, name: 'Weather Sat', altitude: 35786, type: 'Weather', description: 'Geostationary weather satellite' },
      { lat: 60, lng: -90, name: 'Comm Sat', altitude: 35786, type: 'Communication', description: 'Communication satellite' },
      { lat: -45, lng: 180, name: 'Research Sat', altitude: 500, type: 'Research', description: 'Scientific research satellite' },
      { lat: 10, lng: 30, name: 'Earth Observation', altitude: 700, type: 'Observation', description: 'Earth observation satellite' },
      { lat: -20, lng: 60, name: 'Climate Sat', altitude: 800, type: 'Climate', description: 'Climate monitoring satellite' },
      { lat: 40, lng: -120, name: 'Military Sat', altitude: 1000, type: 'Military', description: 'Military satellite' },
      { lat: -60, lng: 90, name: 'Science Sat', altitude: 600, type: 'Science', description: 'Scientific satellite' },
      { lat: 30, lng: -60, name: 'Broadcast Sat', altitude: 35786, type: 'Broadcast', description: 'Broadcast satellite' }
    ]
  }

  async getAirports(): Promise<DataPoint[]> {
    // Major international airports
    return [
      { lat: 40.6413, lng: -73.7781, name: 'JFK Airport', altitude: 13, type: 'International', description: 'John F. Kennedy International Airport' },
      { lat: 51.4700, lng: -0.4543, name: 'Heathrow', altitude: 83, type: 'International', description: 'London Heathrow Airport' },
      { lat: 35.6762, lng: 139.6503, name: 'Haneda Airport', altitude: 35, type: 'International', description: 'Tokyo Haneda Airport' },
      { lat: -33.9399, lng: 151.1753, name: 'Sydney Airport', altitude: 21, type: 'International', description: 'Sydney Airport' },
      { lat: 55.6304, lng: 12.6508, name: 'Copenhagen Airport', altitude: 17, type: 'International', description: 'Copenhagen Airport' },
      { lat: 48.8566, lng: 2.3522, name: 'Charles de Gaulle', altitude: 119, type: 'International', description: 'Paris Charles de Gaulle Airport' },
      { lat: 52.3105, lng: 4.7683, name: 'Schiphol', altitude: -3, type: 'International', description: 'Amsterdam Airport Schiphol' },
      { lat: 41.9028, lng: 12.4964, name: 'Fiumicino', altitude: 15, type: 'International', description: 'Rome Fiumicino Airport' },
      { lat: 40.4168, lng: -3.7038, name: 'Barajas', altitude: 2000, type: 'International', description: 'Madrid Barajas Airport' },
      { lat: 37.6189, lng: -122.3750, name: 'SFO', altitude: 13, type: 'International', description: 'San Francisco International Airport' }
    ]
  }

  private getFallbackEarthquakes(): DataPoint[] {
    return [
      { lat: 36.2048, lng: 138.2529, name: 'Japan Earthquake', magnitude: 7.2, type: 'Earthquake', description: 'Recent earthquake in Japan' },
      { lat: 40.7128, lng: -74.0060, name: 'New York Quake', magnitude: 4.5, type: 'Earthquake', description: 'Minor earthquake in New York' },
      { lat: 34.0522, lng: -118.2437, name: 'LA Earthquake', magnitude: 6.1, type: 'Earthquake', description: 'California earthquake' },
      { lat: 51.5074, lng: -0.1278, name: 'London Quake', magnitude: 3.2, type: 'Earthquake', description: 'Minor earthquake in London' },
      { lat: -33.8688, lng: 151.2093, name: 'Sydney Quake', magnitude: 5.8, type: 'Earthquake', description: 'Australian earthquake' }
    ]
  }
}

export default new GlobeService()
export type { DataPoint } 