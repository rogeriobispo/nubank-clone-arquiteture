interface ITemplateVariables {
  [key: string]: string | number;
}

interface IParseMailTemplateDTO {
  templateFileContent: string;
  variables: ITemplateVariables;
}

export default IParseMailTemplateDTO;
export { ITemplateVariables };
