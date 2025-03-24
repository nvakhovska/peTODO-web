import { useEffect } from "react";

const GoogleAuthCallback = () => {
  useEffect(() => {
    const handleAuth = async () => {
      const hashData = window.document.body.textContent;

      if (hashData) {
        try {
          const json = JSON.parse(hashData);

          const token = json.token;

          if (token) {
            window.opener.postMessage({ token }, "*");
            window.close(); // Close the popup
          }
        } catch (error) {
          console.error("Failed to parse token:", error);
        }
      }
    };

    handleAuth();
  }, []);

  return <p>Logging you in...</p>;
};

export default GoogleAuthCallback;
