import { useEffect, useState } from "react";
import { useWeb } from "../web-context";
import { useHistory, useParams } from "react-router-dom";
import Card from "../components/card";
import TextInput from "../components/inputs/text-input";
import Select from "../components/inputs/select";
import Textarea from "../components/inputs/textarea";
import Button from "../components/button";
import { Controller, useForm, useFormState } from "react-hook-form";
import service from "../service";
import Loading from "../components/loading";
import OverlayLoading from "../components/overlay-loading";
import Dropzone from "../components/inputs/dropzone";
import Richtext from "../components/inputs/richtext";

export default function ComposePost() {
  const webContext = useWeb();
  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      title: "",
      thumbnail: "",
      text: "",
    },
  });
  const { errors } = useFormState({ control });
  const { type, action, id } = useParams();
  const history = useHistory();
  const [typeDesc, setTypeDesc] = useState({});
  const [loading, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);

  const onSubmit = (data) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }

    setPostLoading(true);

    service({
      url: action === "edit" ? `/post/${type}/${id}` : `/post/${type}`,
      data: formData,
      method: action === "edit" ? "PUT" : "POST",
    })
      .then((response) => {
        history.push("/" + type);
      })
      .catch((e) => {
        setPostLoading(false);
      });
  };

  useEffect(() => {
    const getPostType = webContext.state.formMapping.postType?.find(
      (predicate) => predicate.key === type
    );
    if (getPostType) {
      setTypeDesc(getPostType);
      webContext.dispatch({
        type: "titlePage",
        value: (action === "add" ? "Tambah " : "Edit ") + getPostType.name,
      });
    } else {
      history.push("/");
    }
    if (action === "edit") {
      setLoading(true);
      service
        .get(`/post/id/${id}`)
        .then((response) => {
          const { title, text, thumbnail } = response.data.success.data;
          reset({
            title,
            text,
            thumbnail,
          });
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
        });
    }
  }, []);

  return (
    <Card>
      {postLoading && <OverlayLoading />}
      {loading ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            type="text"
            label={typeDesc.title?.name}
            error={errors?.title?.message}
            {...register("title", { required: "Tidak boleh kosong" })}
          />
          {Array.isArray(typeDesc.thumbnail?.type) && (
            <Controller
              control={control}
              name="thumbnail"
              render={({ field: { value, onChange } }) => (
                <Select
                  onChange={({ value }) => onChange(value)}
                  label={typeDesc.thumbnail?.name}
                  options={typeDesc.thumbnail?.type}
                  value={typeDesc.thumbnail?.type.find(
                    (predicate) => predicate.value === value
                  )}
                  error={errors?.thumbnail?.message}
                />
              )}
            />
          )}
          {typeDesc.thumbnail?.type === "upload" && (
            <Controller
              control={control}
              name="thumbnail"
              render={({ field: { onChange, value } }) => (
                <Dropzone
                  value={value}
                  label={typeDesc.thumbnail?.name}
                  onChange={(file) => {
                    onChange(file[0]);
                  }}
                />
              )}
            />
          )}
          {typeDesc.thumbnail?.type === "string" && (
            <TextInput
              type="text"
              label={typeDesc.thumbnail?.name}
              {...register("thumbnail")}
            />
          )}
          {typeDesc.text?.type === "text" && (
            <Textarea
              label={typeDesc.text?.name}
              rows={8}
              error={errors?.text?.message}
              {...register("text", { required: "Tidak boleh kosong" })}
            />
          )}
          {typeDesc.text?.type === "richtext" && (
            <Controller
              control={control}
              name="text"
              rules={{ required: "Tidak boleh kosong" }}
              render={({ field: { onChange, value } }) => (
                <Richtext
                  onChange={(text) => onChange(text)}
                  value={value}
                  label={typeDesc.text?.name}
                />
              )}
            />
          )}
          {typeDesc.text?.type === "string" && (
            <TextInput
              type="text"
              label={typeDesc.text?.name}
              error={errors?.text?.message}
              {...register("text", { required: "Tidak boleh kosong" })}
            />
          )}
          <Button type="submit" className="bg-blue-600">
            Simpan
          </Button>
        </form>
      )}
    </Card>
  );
}
