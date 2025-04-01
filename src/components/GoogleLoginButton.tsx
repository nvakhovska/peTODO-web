const GoogleLoginButton = () => {
  const openPopup = () => {
    const width = 500;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const popup = window.open(
      `${import.meta.env.VITE_API_URL}/users/auth/google`,
      "GoogleLogin",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    const receiveMessage = (event: MessageEvent) => {
      const backendOrigin = new URL(import.meta.env.VITE_API_URL).origin;

      if (event.origin !== backendOrigin || !event.data?.token) {
        return;
      }

      // Save token from popup
      localStorage.setItem("token", event.data.token);
      window.location.reload(); // refresh to trigger authContext effect
    };

    window.addEventListener("message", receiveMessage, false);

    const timer = setInterval(() => {
      if (popup?.closed) {
        clearInterval(timer);
        window.removeEventListener("message", receiveMessage);
      }
    }, 500);
  };

  return (
    <button onClick={openPopup} style={{ marginTop: "1rem" }}>
      Login with Google
    </button>
  );
};

export default GoogleLoginButton;
