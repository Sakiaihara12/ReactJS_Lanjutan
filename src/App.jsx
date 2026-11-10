import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./context/auth-context"
import { CartProvider } from "./context/cart-context"
import { ROLES } from "./utils/roles"
import ProtectedRoute from "./components/protected-route"
import GuestRoute from "./components/guest-route"
import PublicLayout from "./layouts/public"
import AdminLayout from "./layouts/admin"
import Home from "./pages/public"
import Books from "./pages/public/books"
import Profile from "./pages/public/profile"
import ShowBook from "./pages/public/books/show"
import Cart from "./pages/public/cart"
import History from "./pages/public/history"
import Login from "./pages/auth/login"
import Register from "./pages/auth/register"
import Forbidden from "./pages/forbidden"
import NotFound from "./pages/not-found"
import Dashboard from "./pages/admin"
import AdminBooks from "./pages/admin/books"
import BookCreate from "./pages/admin/books/create"
import BookEdit from "./pages/admin/books/edit"
import AdminUsers from "./pages/admin/users"
import UserEdit from "./pages/admin/users/edit"
import AdminTransactions from "./pages/admin/transactions"
import AdminGenres from "./pages/admin/genres"
import GenreCreate from "./pages/admin/genres/create"
import GenreEdit from "./pages/admin/genres/edit"
import AdminAuthors from "./pages/admin/authors"
import AuthorCreate from "./pages/admin/authors/create"
import AuthorEdit from "./pages/admin/authors/edit"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
        <Routes>
          {/* Publik + halaman yang butuh login (semua role) */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="books" element={<Books />} />
            <Route path="books/:id" element={<ShowBook />} />

            <Route element={<ProtectedRoute />}>
              <Route path="profile" element={<Profile />} />
              <Route path="cart" element={<Cart />} />
              <Route path="history" element={<History />} />
            </Route>
          </Route>

          {/* Hanya untuk tamu: yang sudah login diarahkan sesuai role */}
          <Route element={<GuestRoute />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Hanya admin */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />

              <Route path="books">
                <Route index element={<AdminBooks />} />
                <Route path="create" element={<BookCreate />} />
                <Route path=":id/edit" element={<BookEdit />} />
              </Route>

              <Route path="users">
                <Route index element={<AdminUsers />} />
                <Route path=":id/edit" element={<UserEdit />} />
              </Route>

              <Route path="transactions" element={<AdminTransactions />} />

              <Route path="genres">
                <Route index element={<AdminGenres />} />
                <Route path="create" element={<GenreCreate />} />
                <Route path=":id/edit" element={<GenreEdit />} />
              </Route>

              <Route path="authors">
                <Route index element={<AdminAuthors />} />
                <Route path="create" element={<AuthorCreate />} />
                <Route path=":id/edit" element={<AuthorEdit />} />
              </Route>
            </Route>
          </Route>

          <Route path="forbidden" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
