import { Injectable } from '@angular/core';
import * as docx from 'docx';
import * as FileSaver from 'file-saver';
import { TextRun } from 'docx';
import * as fs from 'fs';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.main;charset=UTF-8';
const EXCEL_EXTENSION = '.docx';
@Injectable({
  providedIn: 'root'
})

export class LetterRefDoctorWordService {

  constructor() { }

  createDocument() {
    const document = new docx.Document();
    document.Header.createParagraph('')
    .center()
    .createBorder()
    .addRun(
      new TextRun('Letter - Referring Doctor')
      .bold()
      .size(26)
      .color('FF0000')
      .font('Times New Roman'));
    const paragraph = new docx.Paragraph('Some cool text here');
    document.addParagraph(paragraph);
    const packer = new docx.Packer();
    packer.toBuffer(document).then((buffer) => {
      this.saveAsWordFile(buffer, 'First');
  });
  }

  private saveAsWordFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
 }
}
