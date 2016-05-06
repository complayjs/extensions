export default class ComponentExtensionItemSelectorToMembers {
    itemSelectorToMembers() {

        let selector = this.options.itemSelector || '[data-js-item]';
        let domItemsInSubModules = Array.from(this.el.querySelectorAll(
            `${this.moduleSelector}`)
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
                if (this.items[domItem.dataset.jsItem + 's'] &&
                    (this.items[domItem.dataset.jsItem + 's'] instanceof Array)) {
                    // add to pluralized key and array
                    this.items[domItem.dataset.jsItem + 's'].push(domItem);
                } else if (this.items[domItem.dataset.jsItem]) {
                    // make pluralized key and array
                    this.items[domItem.dataset.jsItem + 's'] = [
                        this.items[domItem.dataset.jsItem],
                        domItem
                    ];

                    delete this.items[domItem.dataset.jsItem];
                } else {
                    // just one item
                    this.items[domItem.dataset.jsItem] = domItem;
                }
            }
        });
    }
}