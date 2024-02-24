import { Route, Routes } from "react-router-dom";
import { Paths } from "./paths";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Home } from "./pages/home";
import { WeekReportsPage } from "./pages/week-report";
import { GoodPage } from "./pages/good";
import { EditUser } from "./pages/edit-user";
import { AddSupplier } from "./pages/add-supplier";
import { EditSupplier } from "./pages/edit-supplier";

function App() {
    return (
        <Routes>
            <Route path={ Paths.home } element={ <Home /> } />

            <Route path={ Paths.login } element={ <Login /> } />
            <Route path={ Paths.register } element={ <Register /> } />
            <Route path={ `${Paths.editUser}/:id` } element={ <EditUser /> } />

            <Route path={ Paths.supplierAdd } element={ <AddSupplier /> } />
            <Route path={ `${Paths.supplierEditInfo}/:id` } element={ <EditSupplier /> } />

            <Route path={ Paths.weekReport } element={ <WeekReportsPage /> } />
            <Route path={ Paths.good } element={ <GoodPage /> } />
        </Routes>
    )
}

export default App;
