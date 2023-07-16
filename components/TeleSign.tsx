import { InputGroup, InputLeftElement, Input, Text } from "@chakra-ui/react";
import React from "react";
import { UseFormRegister, FieldValues } from "react-hook-form";

interface TeleSignProps {
  errors: {
    [x: string]: any;
  };
  register: UseFormRegister<FieldValues>;
}

export const TeleSign: React.FC<TeleSignProps> = ({ errors, register }) => {
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
          placeholder="Customer ID"
          borderRadius={0}
          errorBorderColor="crimson"
          isInvalid={errors.customerId && errors.customerId.message}
          {...register(`customerId`, {
            required: `Please provide your customer ID`,
          })}
        />
        {errors.customerId && errors.customerId.message ? (
          <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
            {errors.customerId.message}
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
          placeholder="Api key"
          borderRadius={0}
          errorBorderColor="crimson"
          isInvalid={errors.apiKey && errors.apiKey.message}
          {...register(`apiKey`, {
            required: `Please provide your api key`,
          })}
        />
        {errors.apiKey && errors.apiKey.message ? (
          <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
            {errors.apiKey.message}
          </Text>
        ) : null}
      </InputGroup>
    </>
  );
};
