import { InputGroup, InputLeftElement, Input, Text } from "@chakra-ui/react";
import React from "react";
import { UseFormRegister, FieldValues } from "react-hook-form";

interface TwilioProps {
  errors: {
    [x: string]: any;
  };
  register: UseFormRegister<FieldValues>;
}

export const Twilio: React.FC<TwilioProps> = ({ errors, register }) => {
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
          placeholder="Account SID"
          borderRadius={0}
          errorBorderColor="crimson"
          isInvalid={errors.sid && errors.sid.message}
          {...register(`sid`, {
            required: `Please provide a telnyx api key`,
          })}
        />
        {errors.sid && errors.sid.message ? (
          <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
            {errors.sid.message}
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
          placeholder="Auth Token"
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
          placeholder="Messaging Service SID"
          borderRadius={0}
          errorBorderColor="crimson"
          isInvalid={errors.msgServiceSID && errors.msgServiceSID.message}
          {...register(`msgServiceSID`, {
            required: `Please provide a telnyx messaging profile id`,
          })}
        />
        {errors.msgServiceSID && errors.msgServiceSID.message ? (
          <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
            {errors.msgServiceSID.message}
          </Text>
        ) : null}
      </InputGroup>
    </>
  );
};
