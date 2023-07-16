import { InputGroup, InputLeftElement, Input, Text } from "@chakra-ui/react";
import React from "react";
import { UseFormRegister, FieldValues } from "react-hook-form";

interface SinchProps {
  errors: {
    [x: string]: any;
  };
  register: UseFormRegister<FieldValues>;
}

export const Sinch: React.FC<SinchProps> = ({ errors, register }) => {
  return (
    <>
      <InputGroup w={`100%`} flexDir={`column`}>
        <InputLeftElement
          pointerEvents="none"
          // eslint-disable-next-line react/no-children-prop
          children={`🧰`}
        />
        <Input
          py={`10px`}
          w={`100%`}
          placeholder="Service Plan ID"
          borderRadius={0}
          errorBorderColor="crimson"
          isInvalid={errors.spId && errors.spId.message}
          {...register(`spId`, {
            required: `Please provide a telnyx api key`,
          })}
        />
        {errors.spId && errors.spId.message ? (
          <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
            {errors.spId.message}
          </Text>
        ) : null}
      </InputGroup>
      <InputGroup w={`100%`} flexDir={`column`} mt={`16px`}>
        <InputLeftElement
          pointerEvents="none"
          // eslint-disable-next-line react/no-children-prop
          children={`🔐`}
        />
        <Input
          py={`10px`}
          w={`100%`}
          placeholder="Api Token"
          borderRadius={0}
          errorBorderColor="crimson"
          isInvalid={errors.token && errors.token.message}
          {...register(`token`, {
            required: `Please provide a telnyx messaging profile id`,
          })}
        />
        {errors.token && errors.token.message ? (
          <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
            {errors.token.message}
          </Text>
        ) : null}
      </InputGroup>
      <InputGroup w={`100%`} flexDir={`column`} mt={`16px`}>
        <InputLeftElement
          pointerEvents="none"
          // eslint-disable-next-line react/no-children-prop
          children={`💡`}
        />
        <Input
          py={`10px`}
          w={`100%`}
          placeholder="From Number/s"
          borderRadius={0}
          errorBorderColor="crimson"
          isInvalid={errors.fromNumbers && errors.fromNumbers.message}
          {...register(`fromNumbers`, {
            required: `Please provide a telnyx messaging profile id`,
          })}
        />
        {errors.fromNumbers && errors.fromNumbers.message ? (
          <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
            {errors.fromNumbers.message}
          </Text>
        ) : null}
      </InputGroup>
    </>
  );
};
