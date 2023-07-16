import { InputGroup, InputLeftElement, Input, Text } from "@chakra-ui/react";
import React from "react";
import { UseFormRegister, FieldValues } from "react-hook-form";

interface MessagebirdProps {
  errors: {
    [x: string]: any;
  };
  register: UseFormRegister<FieldValues>;
}

export const Messagebird: React.FC<MessagebirdProps> = ({ register, errors }) => {
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
          placeholder="Messagebird API Key"
          borderRadius={0}
          errorBorderColor="crimson"
          isInvalid={errors.key && errors.key.message}
          {...register(`key`, {
            required: `Please provide your Messagebird API KEY`,
          })}
        />
        {errors.key && errors.key.message ? (
          <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
            {errors.key.message}
          </Text>
        ) : null}
      </InputGroup>
    </>
  );
};
