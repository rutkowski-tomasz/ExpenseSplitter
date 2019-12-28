import { Directive, Input, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { LinkCopiedSnackBarComponent } from '../components/link-copied-snack-bar/link-copied-snack-bar.component';

@Directive({
    selector: '[esShare]'
})
export class ShareDirective {

    @Input() esShareTitle: string;
    @Input() esShareText: string;
    @Input() esShareUrl: string;

    constructor(private snackBar: MatSnackBar) { }

    @HostListener('click', ['$event'])
    public onClick(_: MouseEvent) {

        const nav = (navigator as any);

        if (nav.share) {

            nav.share({
                title: this.esShareTitle,
                text: this.esShareText,
                url: this.esShareUrl,
            });

        } else {
            this.copyToClipboard(this.esShareUrl);

            this.snackBar.openFromComponent(LinkCopiedSnackBarComponent);
        }
    }

    public copyToClipboard(text: string) {
        const textarea = document.createElement('textarea');
        textarea.style.position = 'fixed';
        textarea.style.left = '0';
        textarea.style.top = '0';
        textarea.style.opacity = '0';
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}