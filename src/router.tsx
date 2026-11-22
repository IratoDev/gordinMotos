import {BrowserRouter,Routes, Route} from "react-router-dom";
import { ContextProvider } from "./context/Context";

import Painel from "./pages/painel/painel";
import { PrivateRoute } from "./components/PrivateRoute/PrivateRoute";
import Login from "./pages/login/login";


export default function AppRouter(){

return(
<BrowserRouter>

<ContextProvider>

<Routes>

<Route>
<Route path="/" element={<Login/>}/>
</Route>


<Route element={<PrivateRoute/>}>
<Route path="/dashboard" element={<Painel/>}/>
</Route>

</Routes>

</ContextProvider>

</BrowserRouter>
)

}