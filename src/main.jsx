import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom"; // Vẫn giữ Router ở đây
import { CartProvider } from "./context/CartContext.jsx";
import "./index.css";
import App from "./App.jsx";
import { DataProvider } from "./context/DataContext.jsx";
import { ReviewProvider } from "./context/ReviewContext.jsx";
import { NewsProvider } from "./context/EvenContext.jsx";
import { UsersProvider } from "./context/UserContext.jsx";
import { OrdersProvider } from "./context/OrdersContext.jsx";
import { ThemeProvider } from "./pages/DashBoard/context/ThemeContext.jsx";
import { BlogsProvider } from "./context/BlogsContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { QuizProvider } from "./context/QuizContext.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <Router>
    {" "}
    {/* Chỉ có 1 Router ở đây */}
    <AuthProvider>
      <OrdersProvider>
        <CartProvider>
          <UsersProvider>
            <DataProvider>
              <QuizProvider>
                <ReviewProvider>
                  <ThemeProvider>
                    <NewsProvider>
                      <BlogsProvider>
                        <App />
                      </BlogsProvider>
                    </NewsProvider>
                  </ThemeProvider>
                </ReviewProvider>
              </QuizProvider>
            </DataProvider>
          </UsersProvider>
        </CartProvider>
      </OrdersProvider>
    </AuthProvider>
  </Router>
);
