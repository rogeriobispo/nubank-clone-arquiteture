interface Contact {
  email: string;
  name: string;
}

interface ITemplateVariables {
  [key: string]: string | number;
}

interface MailerObj {
  from: Contact;
  to: Contact;
  subject: string;
  template: string;
  variables: ITemplateVariables;
}

interface IMailSender {
  sendMail(data: MailerObj): Promise<void>;
}

export default IMailSender;
export { MailerObj };
