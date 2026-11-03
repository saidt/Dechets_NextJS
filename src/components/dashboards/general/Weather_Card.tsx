'use client'

import ErrorMsg from "@/components/ErrorMsg";
import Loading from "@/components/ui/Loading";
import { fetch_Weather } from "@/fetch/weather";
import { getResponseData } from "@/lib/html";
import {
  Box,
  CardContent,
  Card,
  Typography,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

const Weather_Card = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchWeather = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 100));
    try {
      //consoleInfo('API_KEY', API_KEY)
      setLoading(true);
      setError('');
      
      const response = await fetch_Weather('Casablanca,MA')
      const data : WeatherData = await getResponseData(response, 'Fetch Wheather Data')
      setWeather(data);
    }
    catch (err: any) {
      setError(`Fetch Weather Data: ${String(err)}`);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  
  return (
    <Card variant="outlined" sx={{ p: "10px" }}>
      <Box
        sx={{
          backgroundColor: "primary.light",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: "20px",
            py: "30px"
          }}
        >
          <Typography sx={{ variant: "h4", fontSize: "18px" }}>
            {weather?.name}
          </Typography>
          {/*<Typography>{formatDate(new Date())}</Typography>*/}
        </Box>
      </Box>
      <CardContent sx={{ padding: '24px 20px 16px !important' }}>
        <Stack sx={{ direction: "row", spacing: 3, gap: "20px" }}>
          {loading ? (
            <Loading />
          ) : (
            <>
              {error ? (                  
                <ErrorMsg error={error} />
              ) : (
                <>
                  <Stack direction="row" spacing={2}>
                    {weather?.weather[0].icon && (
                      <Box
                        sx={{
                          backgroundColor: "primary.light",
                          width: "48px",
                          height: "48px",
                          borderRadius: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white", 
                        }}
                      >
                        <img
                          src={`https://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`}
                          alt={weather?.weather[0].description}
                          className="w-32 h-32"
                        />
                      </Box>
                    )}
                    <Box>
                      <Typography sx={{ variant: "h4", fontSize: "24px", color: "primary.main" }}>
                        {Math.round(weather?.main.temp ?? 0)}°C
                      </Typography>
                      <Typography sx={{ variant: "subtitle2", fontSize: '15px', color: "textSecondary" }}>
                        {weather?.main.humidity} %
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Box>
                      <Typography sx={{ variant: "subtitle2", fontSize: "15px" }}>
                        {weather?.weather[0].description}
                      </Typography>
                      <Typography sx={{ variant: "subtitle2", fontSize: "15px" }}>
                        Feels like {Math.round(weather?.main.feels_like ?? 0)}°C
                      </Typography>
                      <Typography sx={{ variant: "subtitle2", fontSize: "15px" }}>
                        {weather?.wind.speed} m/s
                      </Typography>
                    </Box>
                  </Stack>
                </>
              )}
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Weather_Card;