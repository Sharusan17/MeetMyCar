// import all components 

import {AuthProvider} from "./AuthContext";

import Layout from "./Layout";
import Home_Layout from "./Home_Layout";

import Signup from "./Signup";
import RegisterVehicle  from "./RegisterVehicle";
import Login from "./Login";
import Setting from "./Setting";
import VerifyEmail from "./VerifyEmail";
import ForgotPassword from "./ForgotPassword"
import UpdateProfile from "./UpdateProfile";
import Reauthenticate from "./Reauthenticate";

import SeePost from "./SeePost";
import AddPost from "./AddPost";
import EditPost from "./EditPost";

import Profile from "./Profile";
import Garage from "./Garage";
import CompareSpecs from "./CompareSpecs";

import Event from "./Event";
import AddEvent from "./AddEvent";
import EditEvent from "./EditEvent";

import {BrowserRouter, Routes, Route,} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
          <BrowserRouter>
            <AuthProvider> {/* Provide authentication context */}
              <Routes>
                <Route path="/" 
                  element={
                    <PrivateRoute> {/*Ensures User is logged in */}
                      <Layout>
                        <SeePost />
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
                      <Home_Layout>
                        <Reauthenticate/>
                      </Home_Layout>
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

                <Route path="/setting"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Setting/>
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

                {/* Profile Account with userId*/}
                <Route path="/profile/:userid"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Profile/>
                      </Layout>
                    </PrivateRoute>
                  }
                />

                {/* Profile Account with username*/}
                <Route path="/profile/username/:userName"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Profile/>
                      </Layout>
                    </PrivateRoute>
                  }
                />

                <Route path="/garage/:userid"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Garage/>
                      </Layout>
                    </PrivateRoute>
                  }
                />

                <Route path="/race/:userid"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <CompareSpecs/>
                      </Layout>
                    </PrivateRoute>
                  }
                />

                <Route path="/event"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Event/>
                      </Layout>
                    </PrivateRoute>
                  }
                />

                <Route path="/addevent"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <AddEvent/>
                      </Layout>
                    </PrivateRoute>
                  }
                />

                <Route path="/editevent/:eventId"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <EditEvent/>
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
