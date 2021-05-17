import * as iconCenter from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useWeb } from "../web-context";
import SidebarList from "./sidebar-list";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

export default function Sidebar() {
  const webContext = useWeb();
  const [isExpand, setIsExpand] = useState(webContext.state.sidebarExpanded);

  useEffect(() => {
    let timeout;
    if (webContext.state.sidebarExpanded && !isExpand) {
      timeout = setTimeout(() => {
        setIsExpand(true);
      }, 500);
    } else {
      setIsExpand(webContext.state.sidebarExpanded);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [webContext.state.sidebarExpanded]);

  return (
    <div
      className={
        webContext.state.sidebarExpanded
          ? "fixed top-0 left-0 bg-primary-800 text-white w-0 lg:w-56 transition-all duration-500 z-10"
          : "fixed top-0 left-0 bg-primary-800 text-white w-full lg:w-20 transition-all duration-500 z-10"
      }
      style={{
        boxShadow: "0 5px 10px rgba(0,0,0,0.3)",
      }}
    >
      <OverlayScrollbarsComponent
        className="h-screen"
        options={{ scrollbars: { autoHide: "scroll" } }}
      >
        <div className="flex montserrat font-bold h-16 items-center justify-between p-5 shadow-md">
          <span className={isExpand ? "hidden lg:block" : "block lg:hidden"}>
            Admin Panel
          </span>
          <span className={isExpand ? "block lg:hidden" : "hidden lg:block"}>
            A-Pa
          </span>
          <button
            className="text-white rounded-none w-8 h-8 flex justify-center items-center text-lg lg:hidden"
            type="button"
            onClick={() => {
              webContext.dispatch({ type: "sidebarExpanded", value: true });
            }}
          >
            <FontAwesomeIcon icon={iconCenter.faTimes} />
          </button>
        </div>
        <ul className="my-5">
          <SidebarList
            label="Dashboard"
            icon={iconCenter.faTv}
            path="/dashboard"
            expanded={isExpand}
          />
          <SidebarList
            label="Informasi Dasar"
            icon={iconCenter.faAddressCard}
            path="/basic-information"
            expanded={isExpand}
          />
          <SidebarList
            label="Blog"
            icon={iconCenter.faNewspaper}
            path="/blog"
            expanded={isExpand}
          />
          {webContext.state.formMapping.postType?.map((item, index) => (
            <SidebarList
              key={`${index}`}
              label={item.name}
              icon={iconCenter[item.icon] || iconCenter.faArchive}
              path={`/${item.key}`}
              expanded={isExpand}
            />
          ))}
          {webContext.state.formMapping.gallery?.map((item, index) => (
            <SidebarList
              key={`${index}`}
              label={item.name}
              icon={iconCenter[item.icon] || iconCenter.faImages}
              path={`/gallery/${item.for}`}
              expanded={isExpand}
            />
          ))}
        </ul>
      </OverlayScrollbarsComponent>
    </div>
  );
}
