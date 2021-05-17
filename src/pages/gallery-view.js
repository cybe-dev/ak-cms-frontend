import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useHistory, useParams } from "react-router";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import alertLoading from "../components/alert-loading";
import Button from "../components/button";
import Card from "../components/card";
import Dropzone from "../components/inputs/dropzone";
import Loading from "../components/loading";
import NotFound from "../components/not-found";
import service, { baseURL } from "../service";
import { useWeb } from "../web-context";

const MySwal = withReactContent(Swal);

export default function GalleryView() {
  const webContext = useWeb();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { id } = useParams();
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(18);
  const [data, setData] = useState([]);
  const [uploaded, setUploaded] = useState(null);

  const onDelete = (id) => {
    alertLoading(MySwal);
    service
      .delete("/gallery/" + id)
      .then((response) => {
        getData();
        MySwal.fire("Berhasil", "Data telah dihapus", "success");
      })
      .catch((e) => {
        MySwal.fire("Gagal", "Data gagal dihapus", "error");
      });
  };
  const getData = useCallback(() => {
    setLoading(true);
    service
      .get(`/gallery/post/${id}`, { params: { offset } })
      .then((response) => {
        setLoading(false);
        setData(response.data.success.data.rows);
        setCount(response.data.success.data.count);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, [id]);

  const onUpload = (data) => {
    if (!uploaded) {
      const formData = new FormData();
      for (const file of data) {
        formData.append("gallery", file);
      }

      const cancelSource = axios.CancelToken.source();

      const temp = {
        cancel: cancelSource.cancel,
        progress: 0,
      };

      setUploaded(temp);

      service
        .post(`/gallery/${id}`, formData, {
          cancelToken: cancelSource.token,
          onUploadProgress: (progressEvent) => {
            setUploaded((value) => {
              const fetch = value;
              fetch.progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              return { ...fetch };
            });
          },
        })
        .then((e) => {
          getData();
          setUploaded(null);
        })
        .catch((e) => {
          setUploaded(null);
        });
    }
  };

  useEffect(() => {
    (async () => {
      let post;
      try {
        post = (await service.get(`/post/id/${id}`)).data.success.data;
      } catch (e) {
        history.push("/");
        return;
      }

      webContext.dispatch({ type: "titlePage", value: post.title });
    })();
  }, []);

  useEffect(() => {
    getData();
  }, [offset]);

  return (
    <Card>
      <div className="pb-5 mb-5 border-b border-gray-300">
        <Dropzone
          withoutPreview={true}
          onChange={(file) => {
            onUpload(file);
          }}
        />
      </div>
      {loading ? (
        <Loading />
      ) : data.length ? (
        <div className="grid grid-flow-row grid-cols-3 lg:grid-cols-6 gap-5">
          {data.map((item, index) => (
            <div className="ratio-1-1 border border-gray-400" key={`${index}`}>
              <img
                className="w-full h-full absolute top-0 left-0 object-cover"
                src={item.path.replace("public", baseURL)}
              />
              <div className="bg-black p-1 bg-opacity-0 hover:bg-opacity-50 w-full h-full absolute top-0 left-0 flex items-start justify-end group">
                <button
                  onClick={() => {
                    MySwal.fire({
                      title: "Anda yakin?",
                      text: `Anda akan menghapus gambar ini!`,
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
                  className="bg-red-600 text-white h-6 w-6 opacity-0 group-hover:opacity-100"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <NotFound />
      )}
      {uploaded && (
        <div className="absolute bottom-0 right-0 m-5 w-72">
          <div className="bg-white shadow-lg p-5">
            <div className="mb-3 flex items-end">
              <div className="flex-1">
                <span className="text-gray-700">Mengunggah</span>
                <div className="w-full bg-gray-300 mt-1">
                  <div
                    className="h-2 bg-blue-500 transition-all duration-500"
                    style={{ width: `${uploaded.progress}%` }}
                  />
                </div>
              </div>
              <div className="ml-3">
                <button
                  className="bg-red-600 text-white h-6 w-6"
                  onClick={() => {
                    uploaded.cancel();
                    setUploaded(null);
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
          </div>
        </div>
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
