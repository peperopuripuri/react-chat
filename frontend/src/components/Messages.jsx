import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import leoProfanity from 'leo-profanity';
import {
  Col, Form, InputGroup, Button,
} from 'react-bootstrap';
import useSocketApi from '../hooks/useSocketApi.hook';
import useAuth from '../hooks/useAuth.hook';
import { selectChannels, selectCurrentChannelId, selectMessages } from '../store/slices/selectors';

const MessageItem = ({ msg, user }) => {
  const { body, username, id } = msg;
  const isCurrentUser = username === user.username;

  return (
    <div key={id} className="text-break mb-2">
      <b className={isCurrentUser ? 'text-white bg-secondary' : ''}>{username}</b>
      :
      {' '}
      {body}
    </div>
  );
};

const RenderForm = ({
  t, formHandler, controlInput, inputValue,
}) => (
  <Form onSubmit={formHandler} noValidate className="py-1 border rounded-2">
    <InputGroup hasValidation>
      <Form.Control
        onChange={controlInput}
        name="body"
        aria-label={t('messages.label')}
        placeholder={t('messages.placeholder')}
        className="border-0 p-0 ps-2"
        value={inputValue}
      />
      <Button type="submit" disabled={!inputValue} variant="outline-secondary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          width="20"
          height="20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
          />
        </svg>
        <span className="visually-hidden">{t('messages.send')}</span>
      </Button>
    </InputGroup>
  </Form>
);

const MainCol = ({
  t,
  currentChannel,
  messagesList,
  controlInput,
  formHandler,
  count,
  inputValue,
}) => (
  <Col className="col-10 p-0 d-flex flex-column h-100">
    <div className="bg-light mb-4 p-3 shadow-sm small">
      <p className="m-0">
        <b>
          {t('messages.id')}
          {' '}
          {currentChannel ? currentChannel.name : t('messages.loading')}
        </b>
      </p>
      <span className="text-muted">{t('messagesCount.key', { count })}</span>
    </div>

    <div className="flex-grow-1 overflow-auto px-5" id="messages-box">
      {messagesList}
    </div>

    <div className="mt-auto px-5 mb-2">
      <RenderForm
        t={t}
        formHandler={formHandler}
        controlInput={controlInput}
        inputValue={inputValue}
      />
    </div>
  </Col>
);

const formHandler = (e, currentChannelId, chatApi, user, setInputValue) => {
  e.preventDefault();
  e.target.value = '';
  const formData = new FormData(e.target);
  const body = formData.get('body');
  const clearedMessage = leoProfanity.clean(body);
  const messageData = {
    body: clearedMessage,
    channelId: currentChannelId,
    username: user.username,
  };
  chatApi.sendMessage(messageData);
  setInputValue('');
};

const Messages = () => {
  const chatApi = useSocketApi();
  const { user } = useAuth();
  const { t } = useTranslation();
  const messages = useSelector(selectMessages);
  const channels = useSelector(selectChannels);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const currentChannel = channels.find((c) => c.id === currentChannelId);
  const currentChannelMessages = messages.filter(
    (msg) => msg.channelId === currentChannelId,
  );
  const count = currentChannelMessages.length;

  const [inputValue, setInputValue] = useState('');

  const controlInput = (e) => {
    e.preventDefault();
    setInputValue(e.target.value);
  };

  const messagesList = currentChannelMessages.map((msg) => (
    <MessageItem key={msg.id} msg={msg} user={user} />
  ));

  return (
    <MainCol
      t={t}
      currentChannel={currentChannel}
      messagesList={messagesList}
      controlInput={controlInput}
      formHandler={(e) => formHandler(e, currentChannelId, chatApi, user, setInputValue)}
      count={count}
      inputValue={inputValue}
    />
  );
};

export default Messages;
