import { Router } from "./router";
import { ToastContainer, Flip } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import React, { useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";
import { ContextWrapper } from "./context/contextWrapper";
import { OpizeWrapper } from "opize-design-system";
import "opize-design-system/dist/style/font.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
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
      <OpizeWrapper>
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
          <ReactQueryDevtools initialIsOpen={false} />
          <ContextWrapper>
            <Router />
          </ContextWrapper>
        </QueryClientProvider>
      </OpizeWrapper>
    </div>
  );
}

export default App;
