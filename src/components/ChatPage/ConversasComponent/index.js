/*
 * Copyright 2021 WPPConnect Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React, { useEffect } from "react";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { ContactInfo, Layout, SearchComponent, UserData } from "./style";
import { Search } from "react-feather";
import PropTypes from "prop-types";
import { listenerMessages } from "../../../services/socket-listener";
import { useDrawer } from "components/Drawer";

const defaultImage =
  "https://pbs.twimg.com/profile_images/1259926100261601280/OgmLtUZJ_400x400.png";

const ConversasComponent = ({
  chats,
  setChats,
  contacts,
  onSearch,
  onClickContact,
}) => {
  const drawerCtx = useDrawer();
  useEffect(() => {
    listenerMessages((err, data) => {
      if (err) return;

      const newList = [];
      const filteredList = chats.filter(
        (filtro) => filtro.id !== data.response.chatId
      );

      newList.unshift([...filteredList, data.response]);
      setChats(newList);
    });
  }, [chats]);

  const onChangeContact = () => {
    const elContactsMain = document.querySelector("#all-contacts");
    const contacts = elContactsMain.querySelectorAll(".contact-li");

    for (const user of contacts) {
      user.addEventListener("click", function () {
        const current = document.getElementsByClassName("active");

        if (current.length > 0) {
          current[0].classList.remove("active");
        }

        this.classList.add("active");
      });
    }
  };

  return (
    <Layout>
      <SearchComponent style={{ marginBottom: 0 }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => {
            drawerCtx.open();
          }}
          edge="start"
          // className={clsx(classes.menuButton, open && classes.hide)}
        >
          <MenuIcon />
        </IconButton>
        <input placeholder={"Pesquisar"} onChange={(e) => onSearch(e)} />{" "}
        <Search />
      </SearchComponent>

      <ul id={"all-contacts"} onClick={() => onChangeContact()}>
        {chats.length > 0
          ? chats.map((chat, index) => {
              return (
                <li
                  className={"contact-li"}
                  key={index}
                  onClick={() => onClickContact(chat)}
                >
                  <ContactInfo>
                    <input type={"radio"} name={"contact"} />

                    <UserData>
                      <img
                        src={`https://ui-avatars.com/api/?name=${chat.name}?background=random`}
                        alt={`${chat.name}`}
                        loading={"lazy"}
                        onError={(e) =>
                          (e.target.src =
                            "https://pbs.twimg.com/profile_images/1259926100261601280/OgmLtUZJ_400x400.png")
                        }
                      />
                      <div className={"principal-info"}>
                        <p className={"contact-name"}>
                          {contacts.find(
                            (item) => item.id._serialized === chat.id
                          )?.name ||
                            chat.name ||
                            chat?.id?.replace("@c.us", "").replace("@g.us", "")}
                        </p>
                        <div className={"contact-message"}>
                          {!chat.msgs
                            ? "Não foi possível carregar as mensagens anteriores..."
                            : chat.msgs.length > 0
                            ? chat.msgs[chat.msgs.length - 1].type ===
                                "image" ||
                              chat.msgs[chat.msgs.length - 1].type ===
                                "video" ||
                              chat.msgs[chat.msgs.length - 1].type === "file" ||
                              chat.msgs[chat.msgs.length - 1].type === "ptt" ||
                              chat.msgs[chat.msgs.length - 1].type === "sticker"
                              ? "Mensagem de mídia"
                              : chat.msgs[chat.msgs.length - 1].type ===
                                "revoked"
                              ? "Mensagem Excluída"
                              : chat.msgs[chat.msgs.length - 1].type === "gp2"
                              ? "Não há mensagens"
                              : chat.msgs[chat.msgs.length - 1].type ===
                                "notification_template"
                              ? "Não há mensagens"
                              : chat.msgs[chat.msgs.length - 1].body
                            : "Não foi possível carregar as mensagens anteriores..."}

                          {chat.unreadCount !== 0 && (
                            <div className={"unread-message"} />
                          )}
                        </div>
                      </div>
                    </UserData>
                  </ContactInfo>
                </li>
              );
            })
          : null}
      </ul>
    </Layout>
  );
};

ConversasComponent.propTypes = {
  chats: PropTypes.any.isRequired,
  onSearch: PropTypes.func.isRequired,
  onClickContact: PropTypes.func.isRequired,
};

export default ConversasComponent;
