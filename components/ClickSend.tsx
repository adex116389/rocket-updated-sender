import { InputGroup, InputLeftElement, Input, Text } from "@chakra-ui/react";
import React from "react";
import { UseFormRegister, FieldValues } from "react-hook-form";

interface ClickSendProps {
  errors: {
    [x: string]: any;
  };
  register: UseFormRegister<FieldValues>;
}

export const ClickSend: React.FC<ClickSendProps> = ({ errors, register }) => {
  return (
    <>
      <InputGroup w={`100%`} flexDir={`column`}>
        <InputLeftElement
          pointerEvents="none"
          // eslint-disable-next-line react/no-children-prop
          children={`😎`}
        />
        <Input
          py={`10px`}
          w={`100%`}
          placeholder="Username"
          borderRadius={0}
          errorBorderColor="crimson"
          isInvalid={errors.username && errors.username.message}
          {...register(`username`, {
            required: `Please provide a telnyx api key`,
          })}
        />
        {errors.username && errors.username.message ? (
          <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
            {errors.username.message}
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
          placeholder="Api Key"
          borderRadius={0}
          errorBorderColor="crimson"
          isInvalid={errors.apiKey && errors.apiKey.message}
          {...register(`apiKey`, {
            required: `Please provide a telnyx messaging profile id`,
          })}
        />
        {errors.apiKey && errors.apiKey.message ? (
          <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
            {errors.apiKey.message}
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
