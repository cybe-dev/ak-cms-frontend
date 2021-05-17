import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router";
import Alert from "../components/alert";
import Button from "../components/button";
import TextInput from "../components/inputs/text-input";
import service from "../service";
import { useWeb } from "../web-context";

export default function Login() {
  const webContext = useWeb();
  const [cookies, setCookies] = useCookies([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failed, setFailed] = useState(false);

  const history = useHistory();

  const login = () => {
    service
      .get("/auth/login", {
        params: {
          email,
          password,
        },
      })
      .then((response) => {
        const { token } = response.data.success.data;
        service.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        service
          .get("/form-mapping")
          .then(({ data }) => {
            setFailed(false);
            setCookies("token", token, {
              path: "/",
              maxAge: 86400,
            });
            webContext.dispatch({ type: "formMapping", value: data });
            webContext.dispatch({ type: "auth", value: true });
            history.push("/");
          })
          .catch((e) => {});
      })
      .catch((e) => {
        setFailed(true);
      });
  };
  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className="bg-primary-50 w-full min-h-screen flex justify-center items-center p-5">
        <div className="bg-white w-full md:w-1/2 lg:w-3/5 flex shadow-sm">
          <div className="flex-1 bg-primary-800 p-5 items-center justify-center text-white hidden lg:flex">
            <span className="font-bold text-xl">Content Dashboard</span>
          </div>
          <div className="w-full lg:w-1/2 py-12 px-8">
            <div className="text-2xl montserrat font-bold text-gray-800 mb-5 text-center">
              Admin Panel
            </div>
            {failed && (
              <Alert color="red" className="mb-5">
                Username atau password anda salah
              </Alert>
            )}
            <form>
              <TextInput
                label="Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextInput
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="text-right">
                <Button
                  className="bg-primary-800 hover:bg-primary-900"
                  onClick={() => login()}
                  type="button"
                >
                  Masuk
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
