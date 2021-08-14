import react, { useRef, useState, useEffect } from 'react';
import cn from 'classnames';

import styles from './contactForm.module.scss';

interface HomeProps {
  /** The value used to fill in as email. */
  emailValue?: string;
}

export default function ContactForm({ emailValue = '' }: HomeProps) {
  /** A reference to the forename input field. Used to focus the form and scroll into view. */
  const forenameInputRef = useRef<HTMLInputElement>(null);

  const [forename, setForename] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState(emailValue);
  const [message, setMessage] = useState('');

  // Validation state
  const [emailValid, setEmailValid] = useState(false);
  const [forenameValid, setForenameValid] = useState(false);
  const [surnameValid, setSurnameValid] = useState(false);
  const [messageValid, setMessageValid] = useState(false);

  // Will be set to true once the submit button is pressed and some fields where not valid.
  const [submitPressed, setSubmitPressed] = useState(false);

  // State for the status message, shown next to the button
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // If the emailValue changed, scroll to the contact section and fill in the email
    if (!isEmpty(emailValue)) {
      forenameInputRef.current?.scrollIntoView();
      forenameInputRef.current?.focus({ preventScroll: true });
      setEmail(emailValue);
      setEmailValid(validateEmailAddress(emailValue));
    }
  }, [emailValue]);

  /** sendEmail() perform a fetch post request to send the mail, after validating all fields. */
  const sendEmail = (): void => {
    setSubmitPressed(true);

    if (
      validateEmailAddress(email) &&
      !isEmpty(forename) &&
      !isEmpty(surname) &&
      !isEmpty(message)
    ) {
      // Every field is valid, so we try to send it.
      setStatusMessage('all valid, proceeding to send email!');
      setIsError(false);

      // Create a URLSearchParams object to store the field values in.
      let data = new URLSearchParams();
      data.append('forename', forename);
      data.append('surname', surname);
      data.append('email', email);
      data.append('message', message);

      // Post the data to php file on the server, this sends the email
      fetch('./php/send_contact_email.php', {
        method: 'post',
        body: data,
      })
        .then(function (response) {
          // If something went wrong log the error and display a generic error message.
          if (response.status == 400)
            return response.text().then(function (text) {
              console.log(text);
              setStatusMessage('Something went wrong. Please check if everything is correct...');
              setIsError(true);
            });

          // If all is well display the success message from the php file.
          return response.text().then(function (text) {
            setStatusMessage(text);
            clearForm();
          });
        })
        .catch(function (error) {
          console.log(error);
          setStatusMessage('Something went wrong. Please check if everything is correct...');
          setIsError(true);
        });
    } else {
      // If the validation failed, show a message displaying which fields are incorrect.
      let message = 'The following fields are not correct: ';
      const invalidFields = [];
      if (!forenameValid) invalidFields.push('forename');
      if (!surnameValid) invalidFields.push('surname');
      if (!emailValid) invalidFields.push('email');
      if (!messageValid) invalidFields.push('message');
      message += invalidFields[0];
      for (let i = 1; i < invalidFields.length - 1; i++) message += ', ' + invalidFields[i];

      if (invalidFields.length > 1) message += ' and ' + invalidFields[invalidFields.length - 1];
      message += '.';
      setStatusMessage(message);
      setIsError(true);
    }
  };

  /**
   * Checks if an email address is valid.
   * @param email The email to validate.
   * @returns Returns true if the email is valid folling the RFC 2822.
   */
  const validateEmailAddress = (email: string): boolean => {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email.toLowerCase());
  };

  /** Handles an email address form change. Called on focus out. */
  const handleEmailChanged = (event: react.ChangeEvent<HTMLInputElement>): void => {
    let email = event.target.value;
    setEmail(event.target.value);

    setEmailValid(validateEmailAddress(email));
  };

  /** Handlers for forename surname and message, checks only if there is something filled in. */
  const handleForenameChanged = (event: react.ChangeEvent<HTMLInputElement>): void => {
    setForename(event.target.value);
    setForenameValid(!isEmpty(event.target.value));
  };
  const handleSurnameChanged = (event: react.ChangeEvent<HTMLInputElement>): void => {
    setSurname(event.target.value);
    setSurnameValid(!isEmpty(event.target.value));
  };
  const handleMessageChanged = (event: react.ChangeEvent<HTMLTextAreaElement>): void => {
    setMessage(event.target.value);
    setMessageValid(!isEmpty(event.target.value));
  };

  /** Checks if a string is empty, has spaces or tabs. */
  const isEmpty = (str: string): boolean => {
    return str === null || /^\s*$/.test(str);
  };

  /** Clears all the form data and status state. */
  const clearForm = (): void => {
    setForename('');
    setSurname('');
    setEmail('');
    setMessage('');
    setSubmitPressed(false);
    setForenameValid(false);
    setSurnameValid(false);
    setEmailValid(false);
    setMessageValid(false);
  };

  return (
    <form className={styles.container} onSubmit={sendEmail}>
      <div className={styles.nameContainer}>
        <label className={styles.customInputField}>
          <input
            ref={forenameInputRef}
            type="text"
            required
            className={cn({
              [styles.isValid]: forenameValid,
              [styles.isInvalid]: !forenameValid && submitPressed,
            })}
            onChange={handleForenameChanged}
            value={forename}
          />
          <span>Forename</span>
        </label>
        <label className={styles.customInputField}>
          <input
            type="text"
            required
            className={cn({
              [styles.isValid]: surnameValid,
              [styles.isInvalid]: !surnameValid && submitPressed,
            })}
            onChange={handleSurnameChanged}
            value={surname}
          />
          <span>Surname</span>
        </label>
      </div>

      <label className={styles.customInputField}>
        <input
          type="text"
          required
          className={cn({
            [styles.isValid]: emailValid,
            [styles.isInvalid]: !emailValid && submitPressed,
          })}
          onChange={handleEmailChanged}
          value={email}
        />
        <span>Email Address</span>
      </label>

      <label className={styles.customTextareaField}>
        <textarea
          required
          className={cn(styles.messageBox, {
            [styles.isValid]: messageValid,
            [styles.isInvalid]: !messageValid && submitPressed,
          })}
          onChange={handleMessageChanged}
          value={message}
        ></textarea>
        <span>Message</span>
      </label>

      <div className={styles.buttonAndMessageContainer}>
        <p className={cn(styles.statusMessage, { [styles.error]: isError })}>{statusMessage}</p>
        <button className={styles.submitButton} type="button" onClick={() => sendEmail()}>
          Submit
        </button>
      </div>
    </form>
  );
}
