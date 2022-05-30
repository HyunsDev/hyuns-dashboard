import { Router } from "./router";
import { ToastContainer, Flip } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { useEffect } from "react";

import UserContextProvider from "./context/userContext";
import TopLoadingContextProvider from "./context/topLoadingBarContext";
import ModalContextProvider from "./context/modalContext";

import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    }
  }
});

function App() {

  // 100vh
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
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        draggable
        transition={Flip}
      />
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={true} />
          <UserContextProvider>
            <TopLoadingContextProvider>
              <ModalContextProvider>
                <Router />
              </ModalContextProvider>
            </TopLoadingContextProvider>
          </UserContextProvider>
        </QueryClientProvider>
    </div>
  );
}

export default App;
