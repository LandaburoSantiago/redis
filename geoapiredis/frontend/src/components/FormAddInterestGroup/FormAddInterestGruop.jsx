import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

const FormAddInterestGruop = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const { group } = useParams();
  const [loadingForm, setLoadingForm] = useState(false);
  const toast = useToast();

  const MessageSuccess = ({ title, description }) => (
    <>
      <Alert status="success" variant="solid">
        <Box flex="1">
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription display="block">{description}</AlertDescription>
        </Box>
      </Alert>
    </>
  );

  const MessageError = (message) => (
    <>
      <Alert status="error" variant="solid">
        <Box flex="1">
          <AlertTitle>Ups!</AlertTitle>
          <AlertDescription display="block">{message}</AlertDescription>
        </Box>
      </Alert>
    </>
  );

  const onSubmit = async (values) => {
    console.log(values);
    try {
      if (values.member && values.longitude && values.latitude) {
        axios.post("http://localhost:3003/addMember", null, {
          params: {
            group,
            ...values,
          },
        });
        toast({
          duration: 2500,
          position: "top",
          render: () =>
            MessageSuccess({
              title: "Agregado exitosamente",
              description: `El lugar fue agregado exitosamente a ${group.replace(
                /[_]/g,
                " "
              )}`,
            }),
        });
        window.location.href = "/interestGroups";
      } else {
        toast({
          duration: 2500,
          position: "top",
          render: () => MessageError("Faltan completar algunos datos..."),
        });
      }
    } catch (error) {
      toast({
        duration: 2500,
        position: "top",
        render: () =>
          MessageError("Ocurrió un error. Por favor inténtelo mas tarde"),
      });
    }
  };

  return (
    <>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Text
          textAlign={"center"}
          fontWeight={"bold"}
          margin="0 auto"
          fontSize={"2xl"}
        >
          Agregar un lugar al grupo de interes {group.replace(/[_]/g, " ")}
        </Text>
        <FormControl isInvalid={errors.member}>
          <FormLabel>Nombre:</FormLabel>
          <Input
            maxLength={30}
            placeholder="Ingrese nombre del lugar..."
            id="member"
            {...register("member", {
              required: "Debe ingresar una nombre del lugar",
            })}
          />
          <FormErrorMessage>
            {errors.member && errors.member.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.longitude}>
          <FormLabel>Longitud:</FormLabel>
          <Input
            maxLength={30}
            placeholder="Ingrese la longitud del lugar..."
            id="longitude"
            {...register("longitude", {
              required: "Debe especificar la longitud del lugar",
            })}
          />
          <FormErrorMessage>
            {errors.longitude && errors.longitude.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.latitude}>
          <FormLabel>Latitud:</FormLabel>
          <Input
            maxLength={30}
            placeholder="Ingrese la latitud del lugar..."
            id="latitude"
            {...register("latitude", {
              required: "Debe especificar la latitud del lugar",
            })}
          />
          <FormErrorMessage>
            {errors.latitude && errors.latitude.message}
          </FormErrorMessage>
        </FormControl>

        <Button isLoading={loadingForm} type="submit" w={"100%"} mt={4}>
          Guardar
        </Button>
      </form>
    </>
  );
};

export default FormAddInterestGruop;
