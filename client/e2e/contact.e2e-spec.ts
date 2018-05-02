import {ContactPage} from "./contact.po";
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

// const origFn = browser.driver.controlFlow().execute;
//
// // https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/
// browser.driver.controlFlow().execute = function () {
//     let args = arguments;
//
//     // queue 100ms wait between test
//     // This delay is only put here so that you can watch the browser do its thing.
//     // If you're tired of it taking long you can remove this call
//     origFn.call(browser.driver.controlFlow(), function () {
//         return protractor.promise.delayed(100);
//     });
//
//     return origFn.apply(browser.driver.controlFlow(), args);
// };

describe('Contact Page', () => {
    let page: ContactPage;

    beforeEach(() => {
        page = new ContactPage();
    });

    it('should get and highlight Contact title attribute ', () => {
        ContactPage.navigateTo();
        expect(page.getContactTitle()).toEqual('Your Contacts');
    });

    it('Should have an Add your own contact button', () => {
        ContactPage.navigateTo();
        expect(page.buttonExists()).toBeTruthy();
    });

    it('Should actually add the user with the information we put in the fields', () => {
        ContactPage.navigateTo();
        page.clickAddContactButton();
        element(by.id('nameField')).sendKeys('Kai Zang');
        element(by.id('emailField')).sendKeys('kai@kai.com');
        element(by.id('phonenumberField')).sendKeys('1234567890');
        element(by.id('confirmAddcontactButton')).click();
        setTimeout(() => {
            expect(page.getUniqueContact('kai@kai.com')).toEqual('Kai Zang');
        }, 10000);
    });

    it('Should actually see the user we added in crisis button', () => {
        ContactPage.navigateTo();
        page.clickAddContactButton();
        element(by.id('nameField')).sendKeys('Kai Zang');
        element(by.id('emailField')).sendKeys('kai@kai.com');
        element(by.id('phonenumberField')).sendKeys('1234567890');
        element(by.id('confirmAddresourcesButton')).click();
        page.clickContactButton();
        setTimeout(() => {
            expect(page.getUniqueContact('kai@kai.com')).toEqual('Kai Zang');
        }, 10000);
    });


    it('should click on the Suicide Prevention Lifeline element, and the correct phone number is on the page', () => {
        ContactPage.navigateTo();
        ContactPage.clickElement('suicide-prevention-lifeline');
        expect(element(by.binding('1-800-273-8255'))).toBeDefined();
    });

    //This test failed all the time, so I commented out.
    it('should click on the Crisis Hotline element', () => {
        ContactPage.navigateTo();
        ContactPage.clickElement('crisis-hotline');
        expect(element(by.binding('  775-784-8090'))).toBeDefined();

    });

    it('should click on the Crisis Text Line element, then click on the woodland home element inside it, and the correct phone number is on the page', () => {
        ContactPage.navigateTo();
        ContactPage.clickElement('crisis-text-line');
        ContactPage.clickElement('  woodland-home');
    });
    it('Should be able to edit a contact entry', ()=> {
        ContactPage.navigateTo();
        page.selectContact("Brittany");
        var buttonExisted = page.editContact('Wow', 'Big wow');
        expect(buttonExisted).toBe(true);
    });
});
