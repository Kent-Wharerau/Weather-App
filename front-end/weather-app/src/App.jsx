import './App.css'
import { useEffect, useState } from 'react'

function App() {

  const [weatherData, setWeatherData] = useState(null);
  const [userEnteredCity, setuserEnteredCity] = useState("")
  const [currentCity, setCurrentCity] = useState("Auckland")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Backend API URL - update this based on your deployment
  const API_BASE_URL = 'http://localhost:3001'

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/weather/${encodeURIComponent(currentCity)}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch weather data: ${response.status}`)
        }
        
        const result = await response.json()
        setWeatherData(result)
      } catch (error) {
        console.error('Error fetching weather:', error)
        setError('Failed to fetch weather data. Please try again.')
        setWeatherData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()
  }, [currentCity])

  function handleChange(e) {
    setuserEnteredCity(e.target.value)
  }

  function handleClick() {
    if (userEnteredCity.trim()) {
      setCurrentCity(userEnteredCity.trim())
      setuserEnteredCity("")
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleClick()
    }
  }

  return (
    <>
      <h1>Weather APP</h1>
      <label>Enter your city: </label>
      <input 
        type="text" 
        value={userEnteredCity} 
        onChange={handleChange} 
        onKeyDown={handleKeyDown}
        disabled={loading}
        placeholder="e.g., London, New York"
      />
      <button onClick={handleClick} disabled={loading || !userEnteredCity.trim()}>
        {loading ? 'Searching...' : 'Search!'}
      </button>

      {error && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          <p>{error}</p>
        </div>
      )}

      {weatherData && !loading && (
        <div>
          <p>
            {weatherData.location.name}'s temperature is {weatherData.current.temp_c} {"\u00b0"}C
          </p>

          <p>
            It's {weatherData.current.condition.text}
          </p>
          <img src={weatherData.current.condition.icon} alt={weatherData.current.condition.text}/>
        </div>
      )}
    </>
  )
}

export default App