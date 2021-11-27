import {
  TEXT_MESSAGE_API_KEY,
  TEXT_MESSAGE_NAME,
  TEXT_MESSAGE_USERNAME,
} from "../constants.js";
import api from "clicksend/api.js";
import moment from "moment";

export async function TextMe(phone_number, message) {
  var smsMessage = new api.SmsMessage();

  smsMessage.from = TEXT_MESSAGE_NAME;
  smsMessage.to = phone_number;

  const today = moment();

  var curHr = today.hour();

  if (curHr < 12) {
    smsMessage.body = "Magandang Umaga Edtessian!" + message;
  } else if (curHr < 18) {
    smsMessage.body = "Magandang Hapon Edtessian!" + message;
  } else {
    smsMessage.body = "Magandang Gabi Edtessian!" + message;
  }

  var smsApi = new api.SMSApi(TEXT_MESSAGE_USERNAME, TEXT_MESSAGE_API_KEY);

  var smsCollection = new api.SmsMessageCollection();

  smsCollection.messages = [smsMessage];

  smsApi
    .smsSendPost(smsCollection)
    .then(function (response) {
      console.log("New Message Send!");
    })
    .catch(function (err) {
      console.error(err.body);
    });
}
