import { useEffect, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import Alert from "../components/alert";
import Button from "../components/button";
import Card from "../components/card";
import TextInput from "../components/inputs/text-input";
import OverlayLoading from "../components/overlay-loading";
import service from "../service";
import { useWeb } from "../web-context";

export default function ChangePassword() {
  const webContext = useWeb();
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const { control, register, handleSubmit, reset, watch } = useForm();
  const { errors } = useFormState({ control });
  const [loading, setLoading] = useState(false);

  const onSubmit = ({ oldPassword, newPassword }) => {
    setLoading(true);
    service
      .put("/auth/change-password", {
        oldPassword,
        newPassword,
      })
      .then((response) => {
        setLoading(false);
        setSuccess(true);
        setFailed(false);
        reset();
      })
      .catch((e) => {
        setLoading(false);
        setSuccess(false);
        setFailed(true);
        reset();
      });
  };

  useEffect(() => {
    webContext.dispatch({ type: "titlePage", value: "Ganti Password" });
  }, []);
  return (
    <Card>
      {loading && <OverlayLoading />}
      <form className="w-full lg:w-1/2" onSubmit={handleSubmit(onSubmit)}>
        {success && (
          <Alert color="green" className="mb-5" collapse={true}>
            Berhasil mengganti password
          </Alert>
        )}
        {failed && (
          <Alert color="red" className="mb-5" collapse={true}>
            Gagal mengganti password
          </Alert>
        )}
        <TextInput
          label="Password Lama"
          type="password"
          error={errors.oldPassword?.message}
          {...register("oldPassword", { required: "Tidak boleh kosong" })}
        />
        <TextInput
          label="Password Baru"
          type="password"
          error={errors.newPassword?.message}
          {...register("newPassword", { required: "Tidak boleh kosong" })}
        />
        <TextInput
          label="Ulangi Password Baru"
          type="password"
          error={errors.newPassword1?.message}
          {...register("newPassword1", {
            required: "Tidak boleh kosong",
            validate: (value) =>
              value === watch("newPassword") || "Ulangi password dengan benar",
          })}
        />
        <Button type="submit" className="bg-blue-600">
          Simpan
        </Button>
      </form>
    </Card>
  );
}
