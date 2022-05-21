import { Router } from "./router";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";

import UserContextProvider from "./context/userContext";
import TopLoadingContextProvider from "./context/topLoadingBarContext";

import 'react-toastify/dist/ReactToastify.css';
const queryClient = new QueryClient();

function App() {
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
