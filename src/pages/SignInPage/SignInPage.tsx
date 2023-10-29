import React from "react";
import useAuth from "../../hooks/use-auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Error from "../../components/Error";
import SubmitButton from "../../components/SubmitButton";
import * as z from "zod";
import { useAzureActiveDirectory } from "../../hooks/use-azure-ad";

const schema = z.object({
  username: z.string().min(1, "El usuario es un campo requerido"),
  password: z.string().min(1, "La contraseña es un campo requerido"),
});

type FormSchemaType = z.infer<typeof schema>;

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting: loading },
  } = useForm<FormSchemaType>({ resolver: zodResolver(schema) });

  const { loginWithEmail } = useAuth();

  const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
    const { username, password } = data;

    try {
      loginWithEmail(username, password);
    } catch (error: any) {
      setError("root", {
        message: error.message,
      });
    }
  };

  const { loginWithActiveDirectory } = useAzureActiveDirectory();

  const handleLoginWithMicrosoft = async () => {
    await loginWithActiveDirectory();
  };

  return (
    <>
      <h3 className="fs-6 fw-bold text-center">Iniciar Sesión</h3>
      <form
        className="d-flex flex-column gap-3"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="input-group">
          <i className="input-group-text bi bi-person-fill" />
          <input
            className="form-control"
            type="text"
            id="username"
            placeholder="Usuario"
            {...register("username")}
            required
          />
          <Error message={errors.username?.message} />
        </div>

        <div className="input-group">
          <i className="input-group-text bi bi-key-fill" />
          <input
            className="form-control"
            id="password"
            type="password"
            placeholder="Contraseña"
            {...register("password")}
            required
          />
          <Error message={errors.password?.message} />
        </div>

        <Error message={errors.root?.message} />
        <SubmitButton label="Iniciar Sesión" loading={loading} />
      </form>

      <SubmitButton
        label="Iniciar Sesión con Microsoft"
        className="btn-secondary text-white"
        icon={<i className="bi bi-microsoft"></i>}
        onClick={handleLoginWithMicrosoft}
      />
    </>
  );
}
