import { useEffect, useState } from "react";
import { useWeb } from "../web-context";
import { Link, useHistory, useParams } from "react-router-dom";
import Card from "../components/card";
import service from "../service";
import Loading from "../components/loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";
import NotFound from "../components/not-found";

export default function Gallery() {
  const webContext = useWeb();
  const { type } = useParams();
  const history = useHistory();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(10);

  const getData = () => {
    setLoading(true);
    window.scrollTo(0, 0);
    service
      .get(`/post/${type}`, {
        params: {
          offset,
          limit,
        },
      })
      .then((response) => {
        setLoading(false);
        setCount(response.data.success.data.count);
        setData(response.data.success.data.rows);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const getPostType = webContext.state.formMapping.gallery?.find(
      (predicate) => predicate.for === type
    );
    if (getPostType) {
      webContext.dispatch({ type: "titlePage", value: getPostType.name });
    } else {
      history.push("/");
    }
  }, [type]);

  useEffect(() => {
    getData();
  }, [offset, type]);

  return (
    <Card>
      {loading ? (
        <Loading />
      ) : data.length ? (
        <>
          {data.map((item, index) => (
            <div className="flex mb-5">
              <div className="text-gray-800 roboto lg:text-lg mr-3">
                {index + 1}.
              </div>
              <div>
                <p className="text-primary-900 font-bold roboto lg:text-lg">
                  {item.title}
                </p>
                <div className="flex items-center">
                  <Link
                    to={`/gallery/${type}/${item.id}`}
                    className="text-gray-500 hover:text-gray-700 text-sm mr-3"
                  >
                    <FontAwesomeIcon icon={faEye} /> Lihat
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <NotFound />
      )}
      <ReactPaginate
        nextLabel="&raquo;"
        previousLabel="&laquo;"
        pageCount={Math.ceil(count / limit)}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        containerClassName="flex justify-end mt-5"
        pageClassName="text-gray-600"
        pageLinkClassName="ml-1 text-sm py-1 px-2 border border-gray-500"
        previousLinkClassName="text-gray-600 ml-1 text-sm py-1 px-2 border border-gray-500"
        nextLinkClassName="text-gray-600 ml-1 text-sm py-1 px-2 border border-gray-500"
        activeLinkClassName="bg-gray-500 text-white"
        initialPage={0}
        breakClassName="ml-2 mr-1"
        onPageChange={({ selected }) => setOffset(selected * limit)}
      />
    </Card>
  );
}
