import dashesToCamelCase from '../../helpers/string/dashes-to-camel-case';

export default class ComponentExtensionItemSelectorToMembers {
    itemSelectorToMembers() {

        let selector = this.options.itemSelector || '[data-js-item]';
        let domItemsInSubModules = Array.from(this.el.querySelectorAll(
            `${this.selector}`)
        );
        let domItems = Array.from(this.el.querySelectorAll(selector));

        this.items = {};

        let isContainedInSubmodule = false;

        domItems.forEach((domItem) => {
            domItemsInSubModules.forEach((domItemInSubModule) => {
                if (!isContainedInSubmodule && domItemInSubModule.contains(domItem)) {
                    isContainedInSubmodule = true;
                }
            });

            if (!isContainedInSubmodule && domItem.dataset.jsItem) {

                let itemsKey = dashesToCamelCase(domItem.dataset.jsItem);

                if (this.items[itemsKey + 's'] &&
                    (this.items[itemsKey + 's'] instanceof Array)) {
                    // add to pluralized key and array
                    this.items[itemsKey + 's'].push(domItem);
                } else if (this.items[itemsKey]) {
                    // make pluralized key and array
                    this.items[itemsKey + 's'] = [
                        this.items[itemsKey],
                        domItem
                    ];

                    delete this.items[itemsKey];
                } else {
                    // just one item
                    this.items[itemsKey] = domItem;
                }
            }
        });
    }
}