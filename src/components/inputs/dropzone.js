import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { baseURL } from "../../service";

const Dropzone = ({
  label = "",
  value,
  onChange,
  withoutPreview = false,
  ...props
}) => {
  const onDrop = useCallback((acceptedFiles) => {
    onChange(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    ...props,
  });
  return (
    <div className="mb-3">
      {label && <label className="roboto text-gray-700">{label}</label>}
      <div
        {...getRootProps()}
        className={
          !isDragActive
            ? "h-32 flex justify-center items-center bg-gray-100 text-center relative"
            : "h-32 flex justify-center items-center bg-primary-100 text-center relative"
        }
      >
        {value && !withoutPreview && (
          <img
            src={
              typeof value === "string"
                ? value.replace("public", baseURL)
                : URL.createObjectURL(value)
            }
            alt="Preview"
            className="w-full h-full object-contain absolute top-0 left-0 opacity-50"
          />
        )}
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="z-10">Lepaskan file disini</p>
        ) : (
          <p className="z-10">
            Tarik & lepaskan file disini atau klik untuk memilih
          </p>
        )}
      </div>
    </div>
  );
};

export default Dropzone;
