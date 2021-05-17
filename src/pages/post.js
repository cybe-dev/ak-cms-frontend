import { useEffect, useState } from "react";
import { useWeb } from "../web-context";
import { Link, useHistory, useParams } from "react-router-dom";
import Card from "../components/card";
import service from "../service";
import Loading from "../components/loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import withReactContent from "sweetalert2-react-content";
import alertLoading from "../components/alert-loading";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import NotFound from "../components/not-found";

const MySwal = withReactContent(Swal);

export default function Post() {
  const webContext = useWeb();
  const { type } = useParams();
  const history = useHistory();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(10);

  const onDelete = (id) => {
    alertLoading(MySwal);
    service
      .delete("/post/" + id)
      .then((response) => {
        getData();
        MySwal.fire("Berhasil", "Data telah dihapus", "success");
      })
      .catch((e) => {
        MySwal.fire("Gagal", "Data gagal dihapus", "error");
      });
  };
  const getData = () => {
    setLoading(true);
    window.scrollTo(0, 0);
    service
      .get(`/post/${type}`, {
        params: {
          offset,
          limit,
          nodesc: "1",
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
    const getPostType = webContext.state.formMapping.postType?.find(
      (predicate) => predicate.key === type
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
      ) : (
        <>
          <div className="mb-5 pb-5 border-b border-gray-200">
            <Link
              to={`/${type}/add`}
              className="p-2 px-5 text-white roboto rounded-none bg-green-700"
            >
              Tambah
            </Link>
          </div>
          {data.length ? (
            data.map((item, index) => (
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
                      to={`/${type}/edit/${item.id}`}
                      className="text-gray-500 hover:text-gray-700 text-sm mr-3"
                    >
                      <FontAwesomeIcon icon={faPen} /> Edit
                    </Link>
                    <span
                      onClick={() => {
                        MySwal.fire({
                          title: "Anda yakin?",
                          text: `Anda akan menghapus ${type} ini!`,
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#3085d6",
                          cancelButtonColor: "#d33",
                          confirmButtonText: "Ya, Lanjutkan!",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            onDelete(item.id);
                          }
                        });
                      }}
                      className="text-gray-500 hover:text-gray-700 ml-3 text-sm cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faTrash} /> Hapus
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <NotFound />
          )}
        </>
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
