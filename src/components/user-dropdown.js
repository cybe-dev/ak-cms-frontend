import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import service from "../service";
import { useWeb } from "../web-context";

export default function UserDropdown() {
  const [show, setShow] = useState(false);
  const webContext = useWeb();
  const [cookies, setCookies, removeCookies] = useCookies([]);
  const history = useHistory();
  return (
    <div className="ml-auto mr-7 relative">
      <button
        className="rounded-full w-10 h-10 bg-gray-200 shadow-sm text-primary-800"
        type="button"
        onClick={() => setShow((value) => !value)}
      >
        <FontAwesomeIcon icon={faUser} />
      </button>
      <div
        className={
          show
            ? "absolute right-0 py-2 bg-white shadow w-56 rounded-lg block"
            : "absolute right-0 py-2 bg-white shadow w-56 rounded-lg hidden"
        }
      >
        <Link
          to="/change-password"
          className="px-5 py-2 roboto text-gray-600 block text-sm"
          onClick={() => {
            setShow(false);
          }}
        >
          Ganti Password
        </Link>
        <a
          href="#"
          className="px-5 py-2 roboto text-gray-600 block text-sm"
          onClick={() => {
            service.defaults.headers.common["Authorization"] = undefined;
            removeCookies("token", {
              path: "/",
            });
            webContext.dispatch({ type: "formMapping", value: {} });
            webContext.dispatch({ type: "auth", value: false });
            history.push("/");
          }}
        >
          Logout
        </a>
      </div>
    </div>
  );
}
