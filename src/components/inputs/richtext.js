import axios from "axios";
import React, { useCallback, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import service, { baseURL } from "../../service";
import Button from "../button";
import Modal from "../modal";
import Dropzone from "./dropzone";
import ImageResize from "quill-image-resize-module-react";

var BaseImageFormat = Quill.import("formats/image");
const ImageFormatAttributesList = ["alt", "height", "width", "style"];

class ImageFormat extends BaseImageFormat {
  static formats(domNode) {
    return ImageFormatAttributesList.reduce(function (formats, attribute) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }
  format(name, value) {
    if (ImageFormatAttributesList.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}
Quill.register(ImageFormat, true);
Quill.register("modules/imageResize", ImageResize);

const Richtext = React.forwardRef(({ label, ...props }, ref) => {
  const modalRef = useRef(null);
  const [uploaded, setUploaded] = useState(null);
  const [returnedURL, setReturnedURL] = useState("");
  const quillObj = useRef(null);

  const onUpload = (file) => {
    const cancelSource = axios.CancelToken.source();
    setUploaded({
      cancel: cancelSource.cancel,
      progress: 0,
    });

    const formData = new FormData();
    formData.append("image", file[0]);
    service
      .post(`/image`, formData, {
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
      .then((response) => {
        setUploaded(null);
        setReturnedURL(response.data.success.data.url);
      })
      .catch((e) => {
        setUploaded(null);
      });
  };

  const imageHandler = useCallback(() => {
    (async () => {
      modalRef.current.show();
    })();
  }, []);

  return (
    <div className="mb-3">
      <label className="roboto text-gray-700">{label}</label>
      <ReactQuill
        className="noreset"
        ref={(el) => {
          quillObj.current = el;
        }}
        theme="snow"
        modules={{
          imageResize: {
            parchment: Quill.import("parchment"),
          },
          toolbar: {
            container: [
              [{ header: [1, 2, false] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
              ],
              [{ align: [] }],
              ["link", "image"],
              ["clean"],
              [{ color: [] }],
            ],
            handlers: {
              image: imageHandler,
            },
          },
        }}
        {...props}
      />
      <Modal
        ref={modalRef}
        title="Tambah Gambar"
        onHide={() => {
          if (uploaded) {
            uploaded.cancel();
            setUploaded(null);
          } else if (returnedURL) {
            setReturnedURL("");
          }
        }}
      >
        {returnedURL ? (
          <>
            <img
              alt="Preview"
              src={returnedURL.replace("public", baseURL)}
              className="max-w-full"
            />
            <div className="flex justify-end my-3">
              <Button
                className="bg-green-600"
                type="button"
                onClick={() => {
                  const range = quillObj.current.getEditorSelection();

                  var res = returnedURL.replace("public", baseURL);

                  quillObj.current
                    .getEditor()
                    .insertEmbed(range.index, "image", res);
                  modalRef.current.hide();
                }}
              >
                Tambah
              </Button>
            </div>
          </>
        ) : uploaded ? (
          <>
            <div className="font-bold roboto text-gray-600 text-center mb-5">
              Mengunggah
            </div>
            <div className="w-full h-6 bg-gray-300 text-right relative">
              <div
                className="absolute top-0 h-full bg-blue-600"
                style={{ width: `${uploaded.progress}%` }}
              />
              {uploaded.progress}%
            </div>
          </>
        ) : (
          <Dropzone
            onChange={(file) => {
              onUpload(file);
            }}
          />
        )}
      </Modal>
    </div>
  );
});

export default Richtext;
