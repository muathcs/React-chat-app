import { Socket } from "dgram";
import React, { useEffect, useState } from "react";
import { AiOutlineMessage } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import { useSelector } from "react-redux";
import * as io from "socket.io-client";

// const socket = io.connect("http://localhost:3001");

type chat_id = {
  chat_id?: number;
  sender_id?: number;
  reciever_id?: number;
  chat?: string;
  timestamp?: string;
  status: "sent";
};

type Message = {
  message: string;
  sent?: boolean;
  sender?: string | null;
};

function Messages({ socket }: { socket: any }) {
  const [recieveMessage, setRecieveMessage] = useState("");

  // an array to display for sent and recieved messages

  const [com, setCom] = useState<chat_id>();

  const [sentMessages, setSentMessages] = useState<string[]>([]);
  const [recievedMessages, setRecievedMessages] = useState<string[]>([]);
  const [allMessages, setAllMessages] = useState<Message[]>([]);

  const logged = localStorage.getItem("logged");

  const [message, setMessage] = useState("");
  // selector
  const { chat_id, sender_id, reciever_id, chat, timestamp, status } =
    useSelector((state: any) => state.message);

  //
  function sendMessage(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key == "Enter") {
      setSentMessages([...sentMessages, message]);
      // console.log("sent", sentMessages);
      socket.emit("send_message", { message });
      setAllMessages([...allMessages, { message: message, sender: logged }]);
      setMessage("");
    }
  }

  // send the message to the database

  function saveMessage(e: React.KeyboardEvent<HTMLInputElement>) {
    try {
      setAllMessages([...allMessages, { message: message, sender: logged }]);
      console.log(allMessages);
      const body = {
        messages: [...allMessages, { message: message, sender: logged }],
        logged: logged,
      };
      const resutl = fetch("http://localhost:3001/chat", {
        method: "PUT",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify(body),
      });
    } catch (error: any) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    socket.on("recieve_message", (data: any) => {
      // recievedMessages.push(data.message)
      // setRecievedMessages([...recievedMessages, data.message])
      setAllMessages([...allMessages, { message: data.message, sender: "" }]);

      // console.log(data.message)
      setRecieveMessage(data.message);
    });
  }, [socket, allMessages]);

  return (
    <>
      <div className="h-full  bg-red-10 w-full relative ">
        <div className="container border-2 shadow-md flex items-center w-full h-20">
          <label className="wotfard">Messages</label>
        </div>
        <div className="w-full  absolute bottom-0">
          <div
            // style={{ width: "100%", height: "100px" }}
            className="w-full overflow-auto bottom-[4rem] flex "
          >
            <div className="flex flex-col flex-auto flex-shrink-0 bg-gray-100 h-full p-4 w-3/4 overflow-auto">
              <div className="flex flex-col h-full overflow-x-auto mb-4">
                <div className="flex flex-col h-full">
                  <div className="grid grid-cols-12 gap-y-2">
                    {/* Map function */}

                    {allMessages.map((item, index) =>
                      item.sent ? (
                        <div
                          key={`message${index}`}
                          className="col-start-1 col-end-8 p-3 rounded-lg"
                        >
                          <div className="flex flex-row items-center">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                              A
                            </div>
                            <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                              <div>{item.message}</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={`message${index}`}
                          className="col-start-6 col-end-13 p-3 rounded-lg"
                        >
                          <div className="flex items-center justify-start flex-row-reverse">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                              A
                            </div>
                            <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                              <div>{item.message}</div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                    {/* end of map */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">
                <AiOutlineMessage size={15} />
              </span>
            </div>
            <input
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  saveMessage(e);
                }
                sendMessage(e);
              }}
              value={message}
              type="text"
              className="block w-full rounded-md border-gray-500 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 bg-gray-100"
              placeholder="Say hi..."
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Messages;
