import {Container}  from "react-bootstrap"
import {AuthProvider} from "./AuthContext";

import Home from "./Home";
import Signup from "./Signup";
import RegisterVehicle  from "./RegisterVehicle";
import Login from "./Login";
import VerifyEmail from "./VerifyEmail";
import ForgotPassword from "./ForgotPassword"
import UpdateProfile from "./UpdateProfile";

import {BrowserRouter, Routes, Route,} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
      <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "1000px"}}>
        <div className="w-100" style={{ maxWidth: "400px"}}>

          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" 
                  element={
                    <PrivateRoute>
                      <Home />
                    </PrivateRoute>
                    }
                />
                
                <Route path="/verify" 
                  element={
                    <PrivateRoute>
                      <VerifyEmail />
                    </PrivateRoute>
                    }
                />

                <Route path="/update-profile" 
                  element={
                    <PrivateRoute>
                      <UpdateProfile />
                    </PrivateRoute>
                    }
                />

                <Route path="/registervehicle"
                  element={
                    <PrivateRoute>
                      <RegisterVehicle/>
                    </PrivateRoute>
                  }
                />
                
                <Route path="/signup" Component={Signup} />
                <Route path="/login" Component={Login} />
                <Route path="/forgot-password" Component={ForgotPassword} />

              </Routes>
            </AuthProvider>
          </BrowserRouter>

       </div>
      </Container>
  )
}

export default App;
