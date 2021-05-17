import * as iconCenter from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import service from "../service";
import { useWeb } from "../web-context";

export default function Dashboard() {
  const webContext = useWeb();
  const [data, setData] = useState({});
  useEffect(() => {
    (async () => {
      try {
        const response = (await service.get("/post/count")).data.success.data;
        const temp = {};
        for (const count of response) {
          temp[count.postType] = count.count;
        }

        setData(temp);
      } catch (e) {}
      return;
    })();
    webContext.dispatch({ type: "titlePage", value: "Dashboard" });
  }, []);
  return (
    <div className="grid grid-flow-row grid-cols-1 lg:grid-cols-4 gap-5">
      {webContext.state.formMapping?.postType?.map((item, index) => (
        <div className="bg-white p-5 flex items-center" key={`${index}`}>
          <div className="flex-1 flex flex-col">
            <span className="w-full text-gray-500 roboto">{item.name}</span>
            <span className="font-bold text-gray-700 text-2xl">
              {data[item.key] || 0}
            </span>
          </div>
          <div className="ml-3 text-blue-400 text-xl">
            <FontAwesomeIcon icon={iconCenter[item.icon] || iconCenter.faTv} />
          </div>
        </div>
      ))}
    </div>
  );
}
