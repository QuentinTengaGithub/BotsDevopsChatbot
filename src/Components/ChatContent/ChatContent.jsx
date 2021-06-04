import React, { useEffect, useRef } from "react";

// Redux
import { connect } from "react-redux";
import { addMessageToChatFrom } from "../../Actions/Bot/botActions";

// Styles
import "./chatContent.scss";

// Components
import ChatItem from "./ChatItem";

// Services
import { getCovidData, getNews } from "../../Services/Bot/botAPI";

// Constants
import { bots } from "../../constants";
import { calculateCPUBenchmark } from "../../utils";

function ChatContent(props) {
  let messagesEndRef = useRef(null);
  let inputRef = useRef(null);

  // Component did mount
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // Scroll to bottom when chat is updated
  useEffect(() => {
    scrollToBottom();
  }, [props.chat.chatArray]);

  const shouldBotRespond = (msg) => {
    if (msg.match(/hello/gi) || msg.match(/hey/gi) || msg.match(/hi/gi)) {
      greet("bot1");
      greet("bot2");
      return;
    }

    if (msg.match(/covid/gi)) {
      getCovidCaseCounts();
      return;
    }

    if (msg.match(/cpu/gi)) {
      speedOfCPU();
      return;
    }

    if (msg.match(/news/gi)) {
      returnNews();
      return;
    }

    if (msg.match(/search/gi)) {
      askKeywordToSearch();
      return;
    }

    if (
      props.chat.chatArray.length >= 2 &&
      props.chat.chatArray[props.chat.chatArray.length - 2].msg.match(
        /search/gi
      )
    ) {
      searchKeyword(msg);
      return;
    }
  };

  /**
   * Bots say hi
   */
  const greet = (bot) => {
    props.addMessageToChatFrom(`Hey there! I am ${bots[bot].name}.`, bot);
    props.addMessageToChatFrom(bots[bot].powers, bot);
  };

  /**
   * Calculates avg. CPU speed in ghz
   */
  const speedOfCPU = async () => {
    const speedBenchmark = calculateCPUBenchmark();
    props.addMessageToChatFrom(speedBenchmark, "bot2");
  };

  /**
   * Gets updated covid data
   */
  const getCovidCaseCounts = async () => {
    let response = await getCovidData();
    props.addMessageToChatFrom(
      `The world covid report is as follows: ${response}`,
      "bot1"
    );
  };

  /**
   * Asks for keyword
   */
  const askKeywordToSearch = () => {
    props.addMessageToChatFrom(
      `Please enter the keyword that you want to search about`,
      "bot2"
    );
  };

  /**
   * @desc Opens new tab and searches for you
   * @param {Search query} msg
   */
  const searchKeyword = (msg) => {
    const query = msg.split(" ").join("+");
    const URL = `https://www.google.com/search?q=${query}`;
    props.addMessageToChatFrom(`Sure, here it is!`, "bot2");
    window.open(URL);
  };

  /**
   * Gets latest news for France
   */
  const returnNews = async () => {
    try {
      const country = { name: "France", code: "fr" };
      const numberOfHeadlines = 5;
      const newsHeadlines = await getNews(country.code, numberOfHeadlines);
      props.addMessageToChatFrom(
        `Here are the top 5 headlines for ${country.name}: \n ${newsHeadlines}`,
        "bot1"
      );
    } catch (err) {
      console.log("Error in getting news.", err);
    }
  };

  /**
   * @desc Sends message to chat that we entered
   * @param {value from inputRef} e
   */
  const sendMessageFromUser = (message = inputRef.current.value) => {
    if (message) {
      props.addMessageToChatFrom(message, "me");
      shouldBotRespond(message);
    }
    inputRef.current.value = "";
  };

  const handleKeyDown = (event) => {
    let val = inputRef.current.value;
    if (event.keyCode === 13 && val !== "") {
      sendMessageFromUser(val);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mainChatWindow">
      <div className="blur"></div>
      <div className="content__body">
        <div className="chat__items">
          {props.chat.chatArray.map((itm) => {
            return (
              <ChatItem
                key={itm.key}
                type={itm.type ? itm.type : "me"}
                msg={itm.msg}
                timeStamp={itm.timeStamp}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="content__footer">
        <div className="sendNewMessage">
          <input
            type="text"
            placeholder="Type a message here"
            onKeyDown={handleKeyDown}
            ref={inputRef}
          />
          <button
            className="btnSendMsg"
            id="sendMsgBtn"
            onClick={() => sendMessageFromUser()}
          >
            {/* <i className="fa fa-paper-plane"></i> */}
            <i className="fa fa-location-arrow"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = ({ chat }) => ({
  chat,
});

const mapDispatchToProps = (dispatch) => ({
  addMessageToChatFrom: (msg, type) =>
    dispatch(addMessageToChatFrom(msg, type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatContent);
