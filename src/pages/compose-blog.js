import { useEffect, useState } from "react";
import { Controller, useForm, useFormState } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import Button from "../components/button";
import Card from "../components/card";
import CreatableSelect from "../components/inputs/creatable-select";
import Richtext from "../components/inputs/richtext";
import TextInput from "../components/inputs/text-input";
import Loading from "../components/loading";
import OverlayLoading from "../components/overlay-loading";
import service from "../service";
import { useWeb } from "../web-context";

export default function ComposeBlog() {
  const webContext = useWeb();
  const { action, id } = useParams();
  const history = useHistory();
  const { register, control, handleSubmit, reset } = useForm();
  const { errors } = useFormState({ control });
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);

  const getCategory = async () => {
    let response;
    try {
      response = (await service.get("/blog/category")).data;
    } catch (e) {
      return;
    }

    const { success } = response;

    const temp = [];
    for (const item of success.data) {
      temp.push({
        label: item.name,
        value: `${item.id}`,
      });
    }

    setCategory(temp);
    return;
  };

  const getData = async () => {
    let response;
    try {
      response = (await service.get(`/blog/${id}`)).data;
    } catch (e) {
      return;
    }

    const { success = {} } = response;
    const { data } = success;

    reset({
      title: data.title,
      body: data.body,
      category: `${data.categoryId || ""}`,
    });
    return;
  };

  const onSubmit = ({ title, body, category }) => {
    setPostLoading(true);
    service({
      method: action === "edit" ? "PUT" : "POST",
      url: action === "edit" ? `/blog/${id}` : "/blog",
      data: {
        title,
        body,
        category,
      },
    })
      .then((response) => {
        history.push("/blog");
      })
      .catch((e) => {
        setPostLoading(false);
      });
  };

  useEffect(() => {
    (async () => {
      await getCategory();
      if (action === "edit") await getData();
      webContext.dispatch({
        type: "titlePage",
        value: (action === "add" ? "Tambah" : "Edit") + " Blog",
      });
      if (action !== "add" && action !== "edit") {
        history.push("/");
      }
    })();
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
            label="Judul"
            error={errors?.title?.message}
            {...register("title", { required: "Tidak boleh kosong" })}
          />
          <Controller
            control={control}
            name="category"
            render={({ field: { value, onChange } }) => (
              <CreatableSelect
                onChange={(value) => {
                  onChange(value?.value || "");
                }}
                label="Kategori"
                isClearable={true}
                options={category}
                value={
                  category.find((predicate) => predicate.value === value) || {
                    label: value,
                    value,
                  }
                }
                error={errors?.category?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="body"
            defaultValue=""
            rules={{ required: "Tidak boleh kosong" }}
            render={({ field: { onChange, value } }) => (
              <Richtext
                onChange={(text) => onChange(text)}
                value={value}
                label="Teks Blog"
              />
            )}
          />
          <Button type="submit" className="bg-blue-600">
            Simpan
          </Button>
        </form>
      )}
    </Card>
  );
}
