import { useState, useEffect } from 'react';
import { config } from '../constants/constant';

const useServerStatus = () => {
  const [data, setData] = useState("Checking server...");
  const [serverStatus, setServerStatus] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const checkServer = async () => {
    try {
      const response = await fetch(config.BACKEND_SERVER_URL + "/server-alive");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      setData(text);
      setServerStatus("Online");
      setRetryCount(0);
    } catch (error) {
      console.error("Failed to fetch server status:", error);
      setData("Server is offline.");
      setServerStatus("Offline");
      setRetryCount(prevCount => prevCount + 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let intervalId;

    const startCheckingServer = () => {
      checkServer();
      intervalId = setInterval(checkServer, 1000);
    };

    startCheckingServer();

    return () => clearInterval(intervalId);
  }, []);

  return { data, serverStatus, loading, retryCount };
};

export default useServerStatus;