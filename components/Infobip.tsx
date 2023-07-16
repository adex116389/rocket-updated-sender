import { InputGroup, InputLeftElement, Input, Text } from "@chakra-ui/react";
import React from "react";
import { UseFormRegister, FieldValues } from "react-hook-form";

interface InfobipProps {
  errors: {
    [x: string]: any;
  };
  register: UseFormRegister<FieldValues>;
}

export const Infobip: React.FC<InfobipProps> = ({ register, errors }) => {
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
          placeholder="Infobip API Key"
          borderRadius={0}
          errorBorderColor="crimson"
          isInvalid={errors.key && errors.key.message}
          {...register(`key`, {
            required: `Please provide your Infobip account API KEY`,
          })}
        />
        {errors.key && errors.key.message ? (
          <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
            {errors.key.message}
          </Text>
        ) : null}
      </InputGroup>
      <InputGroup w={`100%`} flexDir={`column`} mt={`16px`}>
        <InputLeftElement
          pointerEvents="none"
          // eslint-disable-next-line react/no-children-prop
          children={`🔗`}
        />
        <Input
          py={`10px`}
          w={`100%`}
          placeholder="Infobip account URL"
          borderRadius={0}
          errorBorderColor="crimson"
          isInvalid={errors.url && errors.url.message}
          {...register(`url`, {
            required: `Please provide your Infobip account URL`,
          })}
        />
        {errors.url && errors.url.message ? (
          <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
            {errors.url.message}
          </Text>
        ) : null}
      </InputGroup>
    </>
  );
};
