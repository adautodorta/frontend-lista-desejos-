import {Navigate, Route, Routes} from "react-router";
import {Toaster} from "sonner";

import {PrivateRoute} from "./components/PrivateRoute/PrivateRoute";
import {Dashboard} from "./pages/Dashboard/Dashboard";
import {Login} from "./pages/Login/Login";
import {Register} from "./pages/Register/Register";
import QueryProvider from "./utils/QueryProvider";
import routes from "./utils/routes";

function App() {
  return (
    <QueryProvider>
      <Routes>
        <Route path={routes.LOGIN} element={<Login />} />
        <Route path={routes.REGISTER} element={<Register />} />
        <Route element={<PrivateRoute />}>
          <Route path={routes.DASHBOARD} element={<Dashboard />} />
        </Route>
        <Route path="*" element={<Navigate to={routes.LOGIN} replace />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </QueryProvider>
  );
}

export default App;
