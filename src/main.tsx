
import ReactDOM from "react-dom/client";

import { BrowserRouter } from 'react-router-dom';
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./context/AuthContext";
import { GlobalSearchProvider } from "./context/GlobalSearchContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <GlobalSearchProvider>
                    <App />
                </GlobalSearchProvider>
            </AuthProvider>
        </QueryClientProvider>
    </BrowserRouter>
)



