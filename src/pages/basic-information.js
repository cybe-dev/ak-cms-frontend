import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Alert from "../components/alert";
import Button from "../components/button";
import Card from "../components/card";
import Dropzone from "../components/inputs/dropzone";
import TextInput from "../components/inputs/text-input";
import Textarea from "../components/inputs/textarea";
import OverlayLoading from "../components/overlay-loading";
import service from "../service";
import { useWeb } from "../web-context";

export default function BasicInformation() {
  const webContext = useWeb();
  const [loading, setLoading] = useState(false);
  const { register, control, handleSubmit } = useForm({
    defaultValues: webContext.state.basicInformation,
  });
  const [success, setSuccess] = useState(false);

  const onSubmit = (data) => {
    setSuccess(false);
    setLoading(true);
    const formData = new FormData();
    for (const field in data) {
      formData.append(field, data[field]);
    }
    service
      .put("/basic-information", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setLoading(false);
        window.scrollTo(0, 0);
        setSuccess(true);
        webContext.dispatch({
          type: "basicInformation",
          value: response.data.success.data,
        });
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    webContext.dispatch({ type: "titlePage", value: "Informasi Dasar" });
  }, []);
  return (
    <Card>
      {loading && <OverlayLoading />}
      <form className="lg:w-1/2" onSubmit={handleSubmit(onSubmit)}>
        {success && (
          <Alert color="green" className="mb-5" collapse={true}>
            Berhasil memperbaharui informasi
          </Alert>
        )}
        {webContext.state.formMapping.basicInformation?.map((item, index) =>
          item.type === "string" ? (
            <TextInput
              key={`${index}`}
              label={item.name}
              {...register(item.key)}
            />
          ) : item.type === "text" ? (
            <Textarea
              rows={5}
              key={`${index}`}
              label={item.name}
              {...register(item.key)}
            />
          ) : (
            item.type === "upload" && (
              <Controller
                key={`${index}`}
                control={control}
                name={item.key}
                render={({ field: { onChange, value } }) => (
                  <Dropzone
                    value={value}
                    label={item.name}
                    onChange={(file) => {
                      onChange(file[0]);
                    }}
                  />
                )}
              />
            )
          )
        )}
        <Button type="submit" className="bg-blue-600">
          Simpan
        </Button>
      </form>
    </Card>
  );
}
