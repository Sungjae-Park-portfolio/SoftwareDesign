import {browser, element, by, promise} from 'protractor';
import {Key} from 'selenium-webdriver';

export class ContactPage {
    static navigateTo(): promise.Promise<any> {
        return browser.get('/crisis');
    }

    static clickElement(elementId: string){
        const input = element(by.id(elementId));
        input.click();
    }

    // http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
    highlightElement(byObject) {
        function setStyle(element, style) {
            const previous = element.getAttribute('style');
            element.setAttribute('style', style);
            setTimeout(() => {
                element.setAttribute('style', previous);
            }, 200);
            return 'highlighted';
        }
        return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
    }

    getContactTitle() {
        const title = element(by.id('contactTitle')).getText();
        this.highlightElement(by.id('contactTitle'));
        return title;
    }

    selectEnter() {
        browser.actions().sendKeys(Key.ENTER).perform();
    }

    getUniqueContact(email: string) {
        const contact = element(by.id(email)).getText();
        this.highlightElement(by.id(email));

        return contact;
    }

    clickContactButton():promise.Promise<void> {
        this.highlightElement(by.id('contactButton'));
        return element(by.id('contactButton')).click();

    }

    buttonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('addNewContact'));
        return element(by.id('addNewContact')).isPresent();
    }

    clickAddContactButton(): promise.Promise<void> {
        this.highlightElement(by.id('addNewContact'));
        return element(by.id('addNewContact')).click();
    }
}
