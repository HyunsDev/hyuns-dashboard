import { Router } from "./router";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import { useEffect } from "react";

import UserContextProvider from "./context/userContext";
import TopLoadingContextProvider from "./context/topLoadingBarContext";

import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

function App() {
  const handleResize = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`); 
  };
  
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
  
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        draggable
        pauseOnHover
      />
        <QueryClientProvider client={queryClient}>
          <UserContextProvider>
            <TopLoadingContextProvider>
              <Router />
            </TopLoadingContextProvider>
          </UserContextProvider>
        </QueryClientProvider>
      <ToastContainer />
    </div>
  );
}

export default App;
