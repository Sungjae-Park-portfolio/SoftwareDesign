import {JournalingPage} from './journaling.po';
import {browser, element, by} from 'protractor';

const origFn = browser.driver.controlFlow().execute;

describe('Journaling Page', () => {
    let page: JournalingPage;

    beforeEach(() => {
        page = new JournalingPage();
    });

    it('Should be titled Journals', () => {
        JournalingPage.navigateTo();
        expect(JournalingPage.getPageTitle()).toBe('Journals');
    });

    it('Should be able to add a journal entry', () => {
        JournalingPage.navigateTo();
        let buttonExisted = page.addNewJournal('I love CSci', 'I do, in fact, really love CSci.');
        expect(buttonExisted).toBe(true);
    });

    // Works but fails after a while due to how edit works in the e2e
    // Need to make edit select all and replace over adding to the end

    it('Should be able view a journal entry', () => {
        JournalingPage.navigateTo();
        expect(page.getJournalText()).toContain('I love CSci');
    });

    it('Should be able to edit a journal entry', () => {
        JournalingPage.navigateTo();
        let buttonExisted = page.editJournal('Wow', 'Big wow');
        expect(buttonExisted).toBe(true);
    });

    it('Should be able to view a journal entry', () => {
        JournalingPage.navigateTo();
        expect(page.getJournalText()).toContain('Wow');
    });

    it('should contain the crisis button', () => {
        JournalingPage.navigateTo();
        expect(element(by.id('crisis-button'))).toBeDefined();
    });
});
