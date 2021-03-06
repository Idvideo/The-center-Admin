import React, { useState } from "react";
import { SettingsList, SettingsListItem, Icon, ListItemText } from "./List";
import {
  Form,
  FormHeader,
  Label,
  Input,
  SubmitButton,
  ClearButton,
  ResultsContainer,
} from "./Form";
import { ErrorMessage } from "./Text";
import checkmark from "./images/checkmark.svg";
import Result from "./Result";

const TokenForm = () => {
  const [roomName, setRoomName] = useState("");
  const [username, setUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null); // null | string

  const submitTokenForm = (e) => {
    e.preventDefault();
    if (!roomName || !username) {
      setErrorMessage(
        "Eep, something when wrong! We couldn't access the input values. :|"
      );
      return;
    }
    setSubmitting(true);

    const url = `${process.env.REACT_APP_API_BASE_URL}meeting-tokens`;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_DAILY_API_KEY}`,
      },
      mode: "no-cors",
      body: JSON.stringify({
        properties: {
          is_owner: true,
          user_name: username,
          start_video_off: false,
          start_audio_off: false,
          room_name: roomName,
        },
      }),
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        if (json.error) {
          setErrorMessage(`${json.error}: ${json.info}`);
        } else {
          setTokenInfo(json);
          setErrorMessage(false);
        }
        setSubmitting(false);
      })
      .catch((err) => {
        setErrorMessage("That did not work! :'( Please try again.");
        setSubmitting(false);
      });
  };

  const clear = () => {
    setTokenInfo(null);
    setRoomName("");
    setUsername("");
  };

  const handleRoomNameChange = (e) => {
    if (e?.target?.value) {
      setRoomName(e.target.value);
    }
  };
  const handleUsernameChange = (e) => {
    if (e?.target?.value) {
      setUsername(e.target.value);
    }
  };

  return (
    <Form onSubmit={submitTokenForm}>
      <FormHeader>Create a new admin token for a specific room:</FormHeader>
      <SettingsList>
        <SettingsListItem>
          <Icon src={checkmark} alt="checkmark" />
          <ListItemText>Makes you an owner</ListItemText>
        </SettingsListItem>
        <SettingsListItem>
          <Icon src={checkmark} alt="checkmark" />
          <ListItemText>Let's you set your webinar username</ListItemText>
        </SettingsListItem>
      </SettingsList>
      <Label htmlFor="roomName">
        Webinar room name (existing or from form above)
      </Label>
      <Input
        onChange={handleRoomNameChange}
        id="roomName"
        type="text"
        required
        defaultValue={roomName}
      />
      <Label htmlFor="userName">Admin's username</Label>
      <Input
        defaultValue={username}
        onChange={handleUsernameChange}
        id="userName"
        type="text"
        required
      />
      <SubmitButton type="submit" value="Create token" disabled={submitting} />
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {tokenInfo && (
        <ResultsContainer>
          <ClearButton onClick={clear}>Clear results</ClearButton>
          <Result
            column
            main
            label="Your admin link for the webinar:"
            value={`https://discover.daily.co/${roomName}?t=${tokenInfo?.token}`}
            href
          />
          <Result label="Your webinar username:" value={username} />
          <ErrorMessage>
            This token is not saved anywhere. Please keep it somewhere safe!
          </ErrorMessage>
        </ResultsContainer>
      )}
    </Form>
  );
};

export default TokenForm;
