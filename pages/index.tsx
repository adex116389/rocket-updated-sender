import {
  Box,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Textarea,
  Button,
  Text,
  Link,
  useToast,
  Spinner,
  FormControl,
  Switch,
  FormLabel,
} from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";
import type { NextPage } from "next";
import Head from "next/head";
import SocketIOClient, { Socket } from "socket.io-client";
import { useState, useEffect, useContext, useCallback } from "react";
import { FieldValues, useForm, UseFormRegister } from "react-hook-form";
import { useRouter } from "next/router";
import { FileUpload } from "../components/FileUpload";
import { numbersToArray } from "../utility/numbersToArray";
import { FileContext } from "../context/fileContext";
import { Provider } from "../components/Provider";
import { Telnyx } from "../components/Telnyx";
import { Twilio } from "../components/Twilio";
import { Plivo } from "../components/Plivo";
import { Vonage } from "../components/Vonage";
import { Sinch } from "../components/Sinch";
import { ClickSend } from "../components/ClickSend";
import { TeleSign } from "../components/TeleSign";
import { Smtp } from "../components/Smtp";
import { Infobip } from "../components/Infobip";
import { Messagebird } from "../components/Messagebird";

type NumStatus = {
  number: string;
  status: `dispatched` | `sent` | `delivered` | `failed` | `delivery_failed`;
};

let socket: Socket;

const providerComponents = (
  provider: string,
  errors: {
    [x: string]: any;
  },
  register: UseFormRegister<FieldValues>
) => {
  return {
    telnyx: <Telnyx register={register} errors={errors} />,
    twilio: <Twilio register={register} errors={errors} />,
    plivo: <Plivo register={register} errors={errors} />,
    vonage: <Vonage register={register} errors={errors} />,
    sinch: <Sinch register={register} errors={errors} />,
    clicksend: <ClickSend register={register} errors={errors} />,
    telesign: <TeleSign register={register} errors={errors} />,
    infobip: <Infobip register={register} errors={errors} />,
    messagebird: <Messagebird register={register} errors={errors} />,
    smtp: <Smtp register={register} errors={errors} />,
  }[provider ? provider.toLowerCase() : ``];
};

const Home: NextPage = () => {
  const router = useRouter();
  const toast = useToast();
  const [tabIndex, setTabIndex] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const { file: uploadedFile } = useContext(FileContext) as FileType;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({
    // resolver: yupResolver(schema),
    mode: `onSubmit`,
  });

  const [messages, setMessages] = useState<NumStatus[]>([]);

  const [loading, setLoading] = useState<null | boolean>(null);

  const socketInitializer = useCallback(async () => {
    try {
      await fetch(`/api/socketio`);

      socket = SocketIOClient();

      socket.on("connect", () => {
        console.log("SOCKET CONNECTED!", socket.id);
      });

      socket.on("status", (data) => {
        setMessages((prevState) => [...prevState, data]);
      });

      socket.on("loading", ({ status }) => {
        setLoading(status);
      });

      socket.on("allSent", (data) => {
        if (data) {
          toast({
            description:
              "All sent 🥳, please check the status board for statuses",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        }
      });
    } catch (error) {
      console.error("Failed to initialize socket", error);
    }
  }, [toast]);

  // Improved socket cleanup
  useEffect(() => {
    socketInitializer();

    return () => {
      if (socket) socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketInitializer]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!data.numbers && !data.file) {
        toast({
          description: "Either provide a file of numbers or enter the numbers",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }

      const formData = new FormData();
      formData.append(`data`, JSON.stringify(data));
      formData.append(`file`, uploadedFile);

      if (!watch(`provider`)) {
        toast({
          description: `Please select the provider to be used`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }

      await fetch(`/api/send/${watch(`provider`).toLowerCase()}`, {
        method: "POST",
        body: formData,
      });

      // reset();
    } catch (error: any) {
      toast({
        title: `Something went wrong`,
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.log(error);
    }
  });

  const onStopSending = async () => {
    const formData = new FormData();
    formData.append(
      `data`,
      JSON.stringify({
        stopSending: true,
      })
    );
    await fetch(`/api/stopSending`, {
      method: `POST`,
      body: formData,
    });
  };

  return (
    <Box>
      <Head>
        <title>RocketSender</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex p={`50px`} pos={`relative`} flexDir={`column`} minH={`100vh`}>
        <Heading
          color={`black`}
          fontSize={`32px`}
          margin={0}
          textAlign={`center`}
          lineHeight={0.9}
          fontFamily={`didot`}
          pos={`absolute`}
          style={{
            writingMode: `vertical-lr`,
          }}
        >
          RocketSender
        </Heading>
        <Stack spacing={4} px={`20px`} w={`100%`} ml={`20px`}>
          <Flex>
            <Box w={`100%`}>
              <Provider control={control} />
              {providerComponents(watch(`provider`), errors, register)}
              <Tabs
                index={tabIndex}
                onChange={(index) => {
                  setTabIndex(index);
                }}
              >
                <TabList>
                  <Tab _focus={{}}>📞 Numbers</Tab>
                  <Tab _focus={{}}>📁 File</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel px={0}>
                    <InputGroup mt={`16px`} flexDir={`column`}>
                      <InputLeftElement
                        pointerEvents="none"
                        // eslint-disable-next-line react/no-children-prop
                        children={`📞`}
                      />
                      {tabIndex === 0 ? (
                        <>
                          <Input
                            py={`10px`}
                            w={`100%`}
                            placeholder="Phone numbers..."
                            borderRadius={0}
                            pl={`30px`}
                            resize={`none`}
                            errorBorderColor="crimson"
                            isInvalid={
                              !!(errors.numbers && errors.numbers.message)
                            }
                            {...register(`numbers`, {
                              validate: (value) => {
                                if (
                                  value &&
                                  numbersToArray(value).length > 1000
                                ) {
                                  return `Too many numbers, upload a file instead`;
                                }

                                return true;
                              },
                            })}
                          />
                          {errors.numbers && errors.numbers.message ? (
                            <Text
                              mt={`10px`}
                              color={`crimson`}
                              fontSize={`12px`}
                            >
                              {errors.numbers.message as unknown as string}
                            </Text>
                          ) : null}
                        </>
                      ) : null}
                    </InputGroup>
                  </TabPanel>
                  <TabPanel px={0}>
                    {tabIndex === 1 ? (
                      <FileUpload
                        accept={".txt"}
                        // multiple
                        register={register("file")}
                        error={
                          errors.file &&
                          (errors.file.message as unknown as string)
                        }
                      />
                    ) : null}
                    {errors.file && errors.file.message ? (
                      <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
                        {errors.file.message as unknown as string}
                      </Text>
                    ) : null}
                  </TabPanel>
                </TabPanels>
              </Tabs>
              <InputGroup flexDir={`column`}>
                <InputLeftElement
                  pointerEvents="none"
                  // eslint-disable-next-line react/no-children-prop
                  children={`✍️`}
                />
                <Textarea
                  h={`150px`}
                  w={`100%`}
                  placeholder="Message..."
                  borderRadius={0}
                  pl={`30px`}
                  resize={`none`}
                  errorBorderColor="crimson"
                  isInvalid={!!(errors.message && errors.message.message)}
                  {...register(`message`, {
                    required: `Please provide a message to send`,
                  })}
                />
                {errors.message && errors.message.message ? (
                  <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
                    {errors.message.message as unknown as string}
                  </Text>
                ) : null}
              </InputGroup>
              {/* sender id here */}
              {isChecked ? (
                <InputGroup flexDir={`column`} mt={`16px`}>
                  <InputLeftElement
                    pointerEvents="none"
                    // eslint-disable-next-line react/no-children-prop
                    children={`🤳`}
                  />
                  <Input
                    w={`100%`}
                    placeholder="Sender ID e.g Rocket"
                    borderRadius={0}
                    pl={`30px`}
                    resize={`none`}
                    errorBorderColor="crimson"
                    isInvalid={!!(errors.senderId && errors.senderId.message)}
                    {...register(`senderId`, {
                      required: isChecked,
                    })}
                  />
                  {errors.senderId && errors.senderId.message ? (
                    <Text mt={`10px`} color={`crimson`} fontSize={`12px`}>
                      {errors.senderId.message as unknown as string}
                    </Text>
                  ) : null}
                </InputGroup>
              ) : null}
              <Flex my={`32px !important`} alignItems={`center`}>
                {!loading ? (
                  <Flex flexDir={`column`} alignItems={`flex-start`}>
                    <Flex justifyContent={`center`} alignItems={`center`}>
                      <Button
                        leftIcon={<Text as={`span`}>📬</Text>}
                        colorScheme="black"
                        variant="solid"
                        bgColor={`black`}
                        color={`white`}
                        borderRadius={0}
                        minW={`200px`}
                        onClick={onSubmit}
                        disabled={!!loading}
                      >
                        Send
                      </Button>

                      {watch(`provider`) !== `Smtp` ? (
                        <FormControl
                          display="flex"
                          flexDir="column"
                          justifyContent={`center`}
                          pl={`16px`}
                        >
                          <Switch
                            id="sender-id"
                            color={`black`}
                            onChange={(value) => {
                              setIsChecked(value.target.checked);
                            }}
                          />
                          <FormLabel
                            htmlFor="sender-id"
                            mb="0"
                            fontSize={`12px`}
                          >
                            Sender ID (Unavailbale for US & CA)
                          </FormLabel>
                        </FormControl>
                      ) : null}
                    </Flex>
                    <Button
                      leftIcon={<Text as={`span`}>🔐</Text>}
                      variant={`link`}
                      mt={`18px`}
                      _focus={{}}
                      onClick={() => router.push(`/encrypt`)}
                    >
                      go to Encrypt
                    </Button>
                  </Flex>
                ) : (
                  <>
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="black"
                      size="md"
                      mx={`10px`}
                    />
                    <Button
                      colorScheme="red"
                      variant="link"
                      onClick={onStopSending}
                    >
                      🛑 Stop sending
                    </Button>
                  </>
                )}
              </Flex>
            </Box>
            <Box w={`100%`} px={`36px`}>
              {messages.length ? (
                <Box
                  h={`100%`}
                  maxH={`497px`}
                  bgColor={`blackAlpha.800`}
                  w={`100%`}
                  overflow={`none`}
                  overflowY={`scroll`}
                  pos={`relative`}
                  p={`10px`}
                  pl={`20px`}
                  pr={0}
                >
                  <Flex pos={`absolute`} right={`10px`} bottom={`10px`}>
                    <Text mr={`10px`} fontSize={`12px`} color={`yellow`}>
                      SENT:{" "}
                      {
                        messages.filter(
                          (message) => message.status.toLowerCase() === `sent`
                        ).length
                      }
                    </Text>
                    <Text mr={`10px`} fontSize={`12px`} color={`lightgreen`}>
                      DELIVERED:{" "}
                      {
                        messages.filter(
                          (message) =>
                            message.status.toLowerCase() === `delivered`
                        ).length
                      }
                    </Text>
                    <Text fontSize={`12px`} color={`crimson`}>
                      FAILED:{" "}
                      {
                        messages.filter(
                          (message) =>
                            message.status.toLowerCase() === `failed` ||
                            message.status.toLowerCase() === `delivery_failed`
                        ).length
                      }
                    </Text>
                  </Flex>
                  {/* @ts-ignore */}
                  <ScrollableFeed>
                    {messages.map((message, index) => {
                      const status = message.status.toLowerCase();

                      return (
                        <Text
                          key={`${message.status}${index}`}
                          as={`span`}
                          color={
                            status === `sent` || status === `dispatched`
                              ? `yellow`
                              : status === `delivered`
                              ? `lightgreen`
                              : status === `failed` ||
                                status === `delivery_failed`
                              ? `crimson`
                              : `white`
                          }
                        >
                          <Text
                            as={`span`}
                            fontSize={`11px`}
                            display={`block`}
                            w={`100%`}
                          >
                            {message.number} - {status.toUpperCase()}
                          </Text>
                        </Text>
                      );
                    })}
                  </ScrollableFeed>
                </Box>
              ) : null}
            </Box>
          </Flex>
        </Stack>
        <Box
          pos={`absolute`}
          bottom={`20px`}
          fontSize={`12px`}
          color={`gray.500`}
        >
          Built with ❤️ by{" "}
          <Link href={`https://t.me/rocketsmsgateway`}>Rocket</Link> 🚀
        </Box>
      </Flex>
    </Box>
  );
};

export default Home;
