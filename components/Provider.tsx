import {
  Flex,
  Box,
  Button,
  UnorderedList,
  ListItem,
  Image,
  Text,
  Link,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";

interface ProviderProps {
  control: Control<FieldValues, any>;
}

const providers = [
  {
    icon: `telnyx.ico`,
    name: `Telnyx`,
    link: `https://telnyx.com/`,
  },
  {
    icon: `plivo.png`,
    name: `Plivo`,
    link: `https://www.plivo.com/`,
  },
  {
    icon: `sinch.ico`,
    name: `Sinch`,
    link: `https://www.sinch.com/`,
  },
  {
    icon: `twilio.ico`,
    name: `Twilio`,
    link: `https://www.twilio.com/`,
  },
  {
    icon: `vonage.ico`,
    name: `Vonage`,
    link: `https://www.vonage.com/`,
  },
  {
    icon: `clicksend.png`,
    name: `ClickSend`,
    link: `https://www.clicksend.com/en/`,
  },
  {
    icon: `telesign.png`,
    name: `TeleSign`,
    link: `https://www.telesign.com/`,
  },
  {
    icon: `email.png`,
    name: `Smtp`,
    link: `https://bit.ly/3jkWV0k`,
  },
  {
    icon: `infobip.png`,
    name: `Infobip`,
    link: `https://www.infobip.com/`,
  },
  {
    icon: `messagebird.png`,
    name: `Messagebird`,
    link: `https://www.messagebird.com/`,
  },
];

export const Provider: React.FC<ProviderProps> = ({ control }) => {
  const [provider, setProvider] = useState<{ name: string; icon: string }>({
    name: ``,
    icon: ``,
  });
  const [showProviders, setShowProviders] = useState(false);
  return (
    <Flex
      id={`providers`}
      w={`100%`}
      mb={`16px`}
      onBlur={(event) => {
        console.log(`id: `, event.target.id);

        if (event.currentTarget.id === `providers`) {
          return;
        }

        setShowProviders(false);
      }}
    >
      <Box w={`100%`} pos={`relative`}>
        <Button
          w={`100%`}
          borderRadius={0}
          bgColor={`transparent`}
          border={`1px solid #E2E8F0`}
          justifyContent={`space-between`}
          rightIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              style={{
                width: `20px`,
                height: `20px`,
              }}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          }
          _focus={{}}
          onClick={() => setShowProviders(!showProviders)}
        >
          {provider.name ? (
            <Flex>
              <Image
                alt={provider.name}
                src={`/images/providers/${provider.icon}`}
                w={`20px`}
                h={`20px`}
                objectFit={`contain`}
              />
              <Text ml={`10px`}>{provider.name}</Text>
            </Flex>
          ) : (
            `Select provider`
          )}
        </Button>
        <Box
          pos={`absolute`}
          w={`100%`}
          zIndex={9999}
          bgColor={`white`}
          display={showProviders ? `block` : `none`}
        >
          <Controller
            control={control}
            name="provider"
            render={({ field: { onChange } }) => (
              <UnorderedList w={`100%`} listStyleType={`none`} m={0}>
                {providers.map(({ name, icon, link }) => (
                  <ListItem
                    key={name}
                    display={provider.name === name ? `none` : `flex`}
                    w={`100%`}
                    border={`1px solid #E2E8F0`}
                    borderTop={`none`}
                  >
                    <Button
                      w={`100%`}
                      variant={`unstylled`}
                      justifyContent={`space-between`}
                      rightIcon={
                        <Link isExternal href={link}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            style={{
                              width: `15px`,
                              height: `15px`,
                            }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </Link>
                      }
                      onClick={() => {
                        onChange(name);
                        setProvider({
                          name,
                          icon,
                        });
                        setShowProviders(false);
                      }}
                    >
                      <Flex>
                        <Image
                          alt={name}
                          src={`/images/providers/${icon}`}
                          w={`20px`}
                          h={`20px`}
                          objectFit={`contain`}
                        />
                        <Text ml={`10px`}>{name}</Text>
                      </Flex>
                    </Button>
                  </ListItem>
                ))}
              </UnorderedList>
            )}
          />
        </Box>
      </Box>
    </Flex>
  );
};
