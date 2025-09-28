import {Navigate, Route, Routes} from "react-router";

import {PrivateRoute} from "./components/PrivateRoute/PrivateRoute";
import {Login} from "./pages/Login/Login";
import QueryProvider from "./utils/QueryProvider";
import routes from "./utils/routes";

function App() {
  return (
    <QueryProvider>
      <Routes>
        <Route path={routes.LOGIN} element={<Login />} />
        <Route element={<PrivateRoute />}>
        </Route>
        <Route path="*" element={<Navigate to={routes.LOGIN} replace />} />
      </Routes>
    </QueryProvider>
  );
}

export default App;
