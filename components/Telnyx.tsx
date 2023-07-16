import { InputGroup, InputLeftElement, Input, Text } from "@chakra-ui/react";
import React from "react";
import { UseFormRegister, FieldValues } from "react-hook-form";

interface TelnyxProps {
  errors: {
    [x: string]: any;
  };
  register: UseFormRegister<FieldValues>;
}

export const Telnyx: React.FC<TelnyxProps> = ({ register, errors }) => {
  return (
    <>
      <InputGroup w={`100%`} flexDir={`column`}>
        <InputLeftElement
          pointerEvents="none"
          // eslint-disable-next-line react/no-children-prop
          children={`🔐`}
        />
        <Input
          py={`10px`}
          w={`100%`}
          placeholder="Telnyx API Key"
          borderRadius={0}
          errorBorderColor="crimson"
          isInvalid={errors.apiKey && errors.apiKey.message}
          {...register(`apiKey`, {
            required: `Please provide a telnyx api key`
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
          placeholder="Messaging Profile ID"
          borderRadius={0}
          errorBorderColor="crimson"
          isInvalid={errors.msgProfileId && errors.msgProfileId.message}
          {...register(`msgProfileId`, {
            required: `Please provide a telnyx messaging profile id` 
          })}
        />
        {errors.msgProfileId && errors.msgProfileId.message ? (
          <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
            {errors.msgProfileId.message}
          </Text>
        ) : null}
      </InputGroup>
    </>
  );
};
