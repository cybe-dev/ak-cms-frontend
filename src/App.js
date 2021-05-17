import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/private-route";
import BasicInformation from "./pages/basic-information";
import ComposePost from "./pages/compose-post";
import Dashboard from "./pages/dashboard";
import Gallery from "./pages/gallery";
import GalleryView from "./pages/gallery-view";
import Login from "./pages/login";
import Post from "./pages/post";
import Blog from "./pages/blog";
import service from "./service";
import { useWeb } from "./web-context";
import ComposeBlog from "./pages/compose-blog";
import ChangePassword from "./pages/change-password";

function App() {
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies([]);
  const webContext = useWeb();

  useEffect(() => {
    (async () => {
      let basicInformation, formMapping;
      if (cookies.token) {
        service.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${cookies.token}`;
        webContext.dispatch({ type: "auth", value: true });

        try {
          formMapping = (await service.get("/form-mapping")).data;
        } catch (e) {
          formMapping = null;
        }
      }

      try {
        basicInformation = (await service.get("/basic-information")).data
          .success.data;
      } catch (e) {
        basicInformation = null;
      }

      if (formMapping) {
        webContext.dispatch({ type: "formMapping", value: formMapping });
      }

      if (basicInformation) {
        webContext.dispatch({
          type: "basicInformation",
          value: basicInformation,
        });
        setLoading(false);
      }
    })();
  }, [cookies.token]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-primary-900"></div>
    );
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <PrivateRoute path="/change-password">
          <ChangePassword />
        </PrivateRoute>
        <PrivateRoute path="/dashboard">
          <Dashboard />
        </PrivateRoute>
        <PrivateRoute path="/blog/:action/:id">
          <ComposeBlog />
        </PrivateRoute>
        <PrivateRoute path="/blog/:action">
          <ComposeBlog />
        </PrivateRoute>
        <PrivateRoute path="/blog">
          <Blog />
        </PrivateRoute>
        <PrivateRoute path="/basic-information">
          <BasicInformation />
        </PrivateRoute>
        <PrivateRoute path="/gallery/:type/:id">
          <GalleryView />
        </PrivateRoute>
        <PrivateRoute path="/gallery/:type">
          <Gallery />
        </PrivateRoute>
        <PrivateRoute path="/:type/:action/:id">
          <ComposePost />
        </PrivateRoute>
        <PrivateRoute path="/:type/:action">
          <ComposePost />
        </PrivateRoute>
        <PrivateRoute path="/:type">
          <Post />
        </PrivateRoute>
        <Route path="/">
          <Redirect to="/dashboard" />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
