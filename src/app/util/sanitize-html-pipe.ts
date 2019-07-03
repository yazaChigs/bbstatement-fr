import { PipeTransform, Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'sanitizeHtml',
    pure: false
})
export class SanitizeHtmlPipe implements PipeTransform{

    constructor(private sanitizer: DomSanitizer){}

    transform(value: any): any {
        return this.sanitizer.bypassSecurityTrustHtml(value);
    }
}
