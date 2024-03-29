import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { clearScreenDown } from "readline";
import * as io from "socket.io-client";


type Message = {
  sender: string, 
  message: string, 
  receiver: string
}

type InitialState = {
    chat_id?: number, 
    sender_id?: number, 
    receiver_id?: number, 
    messages: Message[], 
    timestamp?: string, 
    status: "sent"
};

const initialState: InitialState = {
  messages:  [],
    status: "sent"
};

export const message = createSlice({
  name: "message",
  initialState,
  reducers: {

    setMessage: (state: InitialState, action: PayloadAction<InitialState>) => {
      let item = action.payload;

      // console.log("Messages: ", item.messages)


      // console.log("action", action.payload)
      return {
        // ...state,
        chat_id: item.chat_id,
        sender_id: item.sender_id,
        receiver_id: item.receiver_id,
        messages: item.messages,
        timestamp: item.timestamp,
        status: item.status

      }

      // console.log("item from reducer: ", item)
      // state.chat = item;
    },
    setMessageOnly: (state: InitialState, action: PayloadAction<Message>) => {
      let item = action.payload;

      // console.log("item: ", item)
      return {
        ...state,
        messages: [...(state.messages || []), {

          sender: item.sender,
          message: item.message,
          receiver: item.receiver
        }]
        
      }
    }

}});


type initialState2 = {
  logged: string, 
  receiver: string,
}

const initialState2: initialState2 = {
  logged: "",
  receiver: "",
}

export const loggedAndReceiver = createSlice({
  name: "loggedAndReceiver",
  initialState: initialState2,
  reducers: {
    setLoggedUser: (state: initialState2, action: PayloadAction<string>) => {

      const item = action.payload;
      
      const newState = {...state, logged:item}

      return newState
    },

    setReceiver: (state: initialState2, action: PayloadAction<string>) => {
      const item = action.payload;

      const newState = {...state, receiver:item}

      return newState

    }
  }


})


// type initialState2 = {
//   io?: any
// }

// const initialState2: initialState2 = {
//   io: io.connect("http://localhost:3001")
// }

// export const ioSlice = createSlice({
//   name: "ioSlice",
//   initialState: initialState2,
//   reducers:

  
// })

export const {
  setMessage,
  setMessageOnly


} = message.actions ;

export const { 
  setLoggedUser,
  setReceiver, 
} = loggedAndReceiver.actions