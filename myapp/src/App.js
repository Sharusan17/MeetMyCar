import {AuthProvider} from "./AuthContext";

import Layout from "./Layout";
import Home_Layout from "./Home_Layout";

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
                      <Home_Layout>
                        <VerifyEmail />
                      </Home_Layout>
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
                      <Home_Layout>
                        <RegisterVehicle/>
                      </Home_Layout>
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

                <Route path="/signup"
                  element={
                    <Home_Layout>
                      <Signup/>
                    </Home_Layout>
                  }
                />

                <Route path="/login"
                  element={
                    <Home_Layout>
                      <Login/>
                    </Home_Layout>
                  }
                />

                <Route path="/forgot-password"
                  element={
                    <Home_Layout>
                      <ForgotPassword/>
                    </Home_Layout>
                  }
                />

              </Routes>
            </AuthProvider>
          </BrowserRouter>
  )
}

export default App;
