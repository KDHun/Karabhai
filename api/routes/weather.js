const express = require("express");
const router = express.Router();
const https = require("https"); // Use the 'https' module for HTTPS requests

router.post("/getWeather", async (req, res) => {
  const cities = req.body?.cities || [];
  const weatherData = {};

  const getWeather = async () => {
    for (let i = 0; i < cities.length; i++) {
      try {
        const response1 = await httpsGet(
          `https://geocode.maps.co/search?q=${cities[i]}`
        );
        
        const data1 = JSON.parse(response1);
        if(data1.length === 0)
        {
            weatherData[cities[i]] = "City not found";
            continue;
        }
        const lat = data1[0].lat;
        const lon = data1[0].lon;
        const response2 = await httpsGet(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );

        const data2 = JSON.parse(response2);

        weatherData[cities[i]] = `${data2.current_weather.temperature}C`;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  await getWeather();
  console.log("Final Weather Data:", weatherData);
  res.send(weatherData);
});

// Helper function to perform HTTPS GET requests
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          resolve(data);
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

module.exports = router;
