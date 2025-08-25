
import ReactDOM from "react-dom/client";

import { BrowserRouter } from 'react-router-dom';
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalSearchProvider } from "./context/GlobalSearchContext";
import AuthProvider from "./context/AuthContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
                <GlobalSearchProvider>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </GlobalSearchProvider>
        </QueryClientProvider>
    </BrowserRouter>
)



