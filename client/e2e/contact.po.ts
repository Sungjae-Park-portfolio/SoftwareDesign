import {browser, element, by, promise} from 'protractor';
import {Key} from 'selenium-webdriver';

export class ContactPage {
    static navigateTo(): promise.Promise<any> {
        return browser.get('/contact');
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

    editContact(name: string, phone: string) {
        const input = element(by.id('editContact'));
        input.click();
        const nameInput = element(by.id('nameField'));
        nameInput.click();
        nameInput.clear();
        nameInput.sendKeys(name);
        const phoneInput = element(by.id('phonenumberField'));
        phoneInput.click();
        phoneInput.clear();
        phoneInput.sendKeys(phone);
        const button = element(by.css('#confirmAddcontactButton'));
        const buttonWasThere = button.isDisplayed();
        button.click();
        return buttonWasThere;
    }

    buttonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('addNewContact'));
        return element(by.id('addNewContact')).isPresent();
    }

    clickAddContactButton(): promise.Promise<void> {
        this.highlightElement(by.id('addNewContact'));
        return element(by.id('addNewContact')).click();
    }

    selectContact(search: string){
        const input = element(by.id('selectContact'));
        input.click();

        // //search for journal
        const nameInput = element(by.id('contactName'));
        nameInput.click();
        nameInput.sendKeys(search);
        //
        // //click journal
        const journal = element(by.cssContainingText('mat-list-item',search));
        journal.click();

    }
}
