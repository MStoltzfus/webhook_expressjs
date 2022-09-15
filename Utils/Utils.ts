import dayjs from "dayjs";

const Utils = {
    webhookTriggerResponse( origin ) {
      console.log( "The Webhook was Triggered!", origin );
      console.log( dayjs().format ( 'MMMM Do YYYY, h:mm:ss a' ) );
    },
  };


export default Utils;