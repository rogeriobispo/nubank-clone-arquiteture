import handleBars from 'handlebars';
import fs from 'fs';

import IMailTemplateProvider from '../models/IMailTemplateProvider';
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

class HandleBarsMailTemplateProvider implements IMailTemplateProvider {
  public async parse({
    templateFileContent,
    variables,
  }: IParseMailTemplateDTO): Promise<string> {
    // const templateFileContent = await fs.promises.readFile(file, {
    //   encoding: 'utf-8',
    // });

    const parseTemplate = handleBars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}

export default HandleBarsMailTemplateProvider;
