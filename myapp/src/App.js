import {AuthProvider} from "./AuthContext";

import Layout from "./Layout";

import Home from "./Home";
import Signup from "./Signup";
import RegisterVehicle  from "./RegisterVehicle";
import Login from "./Login";
import VerifyEmail from "./VerifyEmail";
import ForgotPassword from "./ForgotPassword"
import UpdateProfile from "./UpdateProfile";
import Reauthenticate from "./Reauthenticate";

import SeePost from "./SeePost";
import AddPost from "./AddPost";
import EditPost from "./EditPost";

import {BrowserRouter, Routes, Route,} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" 
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Home />
                      </Layout>
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
                      <Layout>
                        <UpdateProfile />
                      </Layout>
                    </PrivateRoute>
                    }
                />

                <Route path="/reauthenticate"
                  element={
                    <PrivateRoute>
                      <Reauthenticate/>
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

                <Route path="/seepost"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <SeePost/>
                      </Layout>
                    </PrivateRoute>
                  }
                />

                <Route path="/addpost"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <AddPost/>
                      </Layout>
                    </PrivateRoute>
                  }
                />

                <Route path="/editpost/:postId"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <EditPost/>
                      </Layout>
                    </PrivateRoute>
                  }
                />
                
                <Route path="/signup" Component={Signup} />
                <Route path="/login" Component={Login} />
                <Route path="/forgot-password" Component={ForgotPassword} />

              </Routes>
            </AuthProvider>
          </BrowserRouter>
  )
}

export default App;
