const API_KEY = 'ec76675873464c6b8bc21fc0bedf5027';

export async function getUserLocation() {
  try {
    const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}`);
    const data = await response.json();

    if (data.latitude && data.longitude) {
      return {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude)
      };
    } else {
      throw new Error('Location data not available');
    }
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
}