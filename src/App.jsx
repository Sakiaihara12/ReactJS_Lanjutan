import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/public"
import PublicLayout from "./layouts/public"
import Books from "./pages/public/books"
import AdminBooks from "./pages/admin/books"
import Login from "./pages/auth/login"
import Register from "./pages/auth/register"
import AdminLayout from "./layouts/admin"
import RequireAuth from "./components/require-auth"
import Dashboard from "./pages/admin"
import BookCreate from "./pages/admin/books/create"
import AdminGenres from "./pages/admin/genres"
import GenreCreate from "./pages/admin/genres/create"
import GenreEdit from "./pages/admin/genres/edit"
import AdminAuthors from "./pages/admin/authors"
import AuthorCreate from "./pages/admin/authors/create"
import AuthorEdit from "./pages/admin/authors/edit"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="books" element={<Books />} />
        </Route>

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route
          path="admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          
          <Route path="books">
            <Route index element={<AdminBooks />} />
            <Route path="create" element={<BookCreate />} />
          </Route>

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
      </Routes>
    </BrowserRouter>
  )
}

export default App