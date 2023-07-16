import {
  InputGroup,
  InputLeftElement,
  Input,
  Text,
  Box,
} from "@chakra-ui/react";
import React from "react";
import { UseFormRegister, FieldValues } from "react-hook-form";

interface SmtpProps {
  errors: {
    [x: string]: any;
  };
  register: UseFormRegister<FieldValues>;
}

export const Smtp: React.FC<SmtpProps> = ({ errors, register }) => {
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
          placeholder="From email"
          borderRadius={0}
          errorBorderColor="crimson"
          isInvalid={errors.from && errors.from.message}
          {...register(`from`, {
            required: `Please provide a from email`,
          })}
        />
        {errors.from && errors.from.message ? (
          <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
            {errors.from.message}
          </Text>
        ) : null}
      </InputGroup>
      <InputGroup w={`100%`} flexDir={`column`} mt={`16px`}>
        <InputLeftElement
          pointerEvents="none"
          // eslint-disable-next-line react/no-children-prop
          children={`📢`}
        />
        <Input
          py={`10px`}
          w={`100%`}
          placeholder="Subject"
          borderRadius={0}
          errorBorderColor="crimson"
          isInvalid={errors.subject && errors.subject.message}
          {...register(`subject`, {
            required: `Please provide a subject`,
          })}
        />
        {errors.subject && errors.subject.message ? (
          <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
            {errors.subject.message}
          </Text>
        ) : null}
      </InputGroup>
      <Box display="flex" mt={`16px`}>
        <InputGroup flex={2} flexDir={`column`}>
          <Input
            py={`10px`}
            w={`100%`}
            placeholder="Host"
            borderRadius={0}
            errorBorderColor="crimson"
            isInvalid={errors.host && errors.host.message}
            {...register(`host`, {
              required: `Please provide your api key`,
            })}
          />
          {errors.host && errors.host.message ? (
            <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
              {errors.host.message}
            </Text>
          ) : null}
        </InputGroup>
        <InputGroup flex={2} flexDir={`column`} ml={`16px`}>
          <Input
            py={`10px`}
            w={`100%`}
            placeholder="Username"
            borderRadius={0}
            errorBorderColor="crimson"
            isInvalid={errors.user && errors.user.message}
            {...register(`user`, {
              required: `Please provide your api key`,
            })}
          />
          {errors.user && errors.user.message ? (
            <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
              {errors.user.message}
            </Text>
          ) : null}
        </InputGroup>
        <InputGroup flex={2} flexDir={`column`} ml={`16px`}>
          <Input
            py={`10px`}
            w={`100%`}
            placeholder="Password"
            borderRadius={0}
            errorBorderColor="crimson"
            isInvalid={errors.pass && errors.pass.message}
            {...register(`pass`, {
              required: `Please provide your api key`,
            })}
          />
          {errors.pass && errors.pass.message ? (
            <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
              {errors.pass.message}
            </Text>
          ) : null}
        </InputGroup>
        <InputGroup flex={1} flexDir={`column`} ml={`16px`}>
          <Input
            py={`10px`}
            w={`100%`}
            placeholder="Port"
            borderRadius={0}
            errorBorderColor="crimson"
            isInvalid={errors.port && errors.port.message}
            defaultValue="587"
            {...register(`port`, {
              required: `Please provide your api key`,
            })}
          />
          {errors.port && errors.port.message ? (
            <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
              {errors.port.message}
            </Text>
          ) : null}
        </InputGroup>
      </Box>
    </>
  );
};
