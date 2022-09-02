import { Component, ElementRef, ViewChild, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, UrlTree, UrlSegment, PRIMARY_OUTLET, UrlSegmentGroup } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginCmdOutput } from '../../models/auth.models';
import { translate, RxTranslation } from '@rxweb/translate';

import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {
    @translate({ translationName: "veda_mantras" })
    tr: { [key: string]: any }

    @ViewChild('language') languageElement: ElementRef<HTMLSelectElement>;

    activeLanguage: string = "en";
    fontWeight = 300;
    fontSize = 14;
    user: LoginCmdOutput;
    topnavbartoggle: boolean = false;
    public isMenuCollapsed = true;
    constructor(
        @Inject(DOCUMENT) private document: Document,
        private rxTranslation: RxTranslation,
        private router: Router,
        private auth: AuthService,
        private activatedRoute: ActivatedRoute,
        private location: Location) {


        if (localStorage.getItem('locale')) {
            this.activeLanguage = localStorage.getItem('locale');
            if (this.activeLanguage != this.rxTranslation.language) {
                this.rxTranslation.change(this.activeLanguage);
            }
        }

        /*
        router.events.subscribe(t => {
            console.log('from event subscribe, url: ' + router.url);
            this.activeLanguage = t["languageCode"];
            if (this.activeLanguage != this.rxTranslation.language) {
                this.rxTranslation.change(this.activeLanguage);
                localStorage.setItem("locale", this.activeLanguage);
            }
            console.log('from router lang: ' + this.activeLanguage);
        });
        */

        //this.activeLanguage = this.rxTranslation.language;
        //console.log('from rxlang lang: ' + this.activeLanguage);
    }

    checkUser() {
        const isLoggedIn = this.auth.isLoggedIn();
        this.user = this.auth.getUserFromStorage();
        if (isLoggedIn === false || !this.user) {
            return false;
        }

        return true;
    }

    increaseFont() {
        this.fontWeight = this.fontWeight + 10;
        this.fontSize = this.fontSize + 2;
        const container = document.getElementsByClassName('single-content')[0] as HTMLElement;
        if (container) {
            container.style.fontSize = this.fontSize.toString() + " !important";
            console.log(this.fontSize);
        }
    }

    decreaseFont() {
        this.fontWeight = this.fontWeight - 10;
        this.fontSize = this.fontSize - 2;
        const container = document.getElementById('root-id');
        if (container) {
            container.style.fontWeight = this.fontWeight.toString() + " !important";;
            console.log(this.fontWeight);
        }
    }

    changeLanguageDropdown(event) {
        this.activeLanguage = event.target.value;
        const oldLanguageCode = this.rxTranslation.language;
        this.changeLocale(this.activeLanguage);
    }

    handleTopMenu() {
        document.body.classList.toggle('topnavbar-toggle');
    }

    changeLocale(locale: string) {
        const oldLanguageCode = this.rxTranslation.language;
        this.rxTranslation.change(locale);
        localStorage.setItem("locale", locale);
        this.activeLanguage = locale;
        //window.location.reload();
        // this.router.navigate(['orders'], { queryParams: { id: '1234' } });

        var changedLangUrl = this.router.url.replace("/" + oldLanguageCode + "/", "/" + locale + "/");
        this.location.replaceState(changedLangUrl);
        window.location.reload();

    }
}
