export default class WebStorageRepositoryExtension {

    static set storage(store) {
        WebStorageRepositoryExtension._storage = store;
    }

    get storage() {

        let that = this;

        return WebStorageRepositoryExtension._storage || window.localStorage || {
                setItem(id, val) {
                    this[`complay-${that.repositoryId()}-${id}`] = val;
                },

                getItem(id) {
                    return this[`complay-${that.repositoryId()}-${id}`];
                },

                removeItem(id) {
                    delete this[`complay-${that.repositoryId()}-${id}`];
                }
            };
    }

    beforeInitialize(options) {

        let commitId;

        if (options.commitId && this.storage.getItem(`complay-${this.repositoryId()}-keys`)) {
            let commitIds = JSON.parse(this.storage.getItem(`complay-${this.repositoryId()}-keys`)).filter(id => {
                return id === options.commitId ;
            });

            if (commitIds.length) {
                commitId = commitIds[commitIds.length - 1];
            }
        } else if(options.hotDataReload && this.storage.getItem(`complay-${this.repositoryId()}-keys`)) {
            let commitIds = JSON.parse(this.storage.getItem(`complay-${this.repositoryId()}-keys`));

            if (commitIds.length) {
                commitId = commitIds[commitIds.length - 1];
            }
        }

        if (commitId) {
            // create
            this.createRepositoryEntry(
                this.repository,
                commitId,
                JSON.parse(this.storage.getItem(`complay-${this.repositoryId()}-${commitId}`))
            );

            // and apply
            this.rollback(commitId);
        }

        return this;
    }

    repositoryId() {
        return (this.options && this.options.repositoryId) || this.name || 'repository';
    }

    createRepositoryEntry(repos, id, data) {

        this.webstorageIds = this.webstorageIds || [];
        this.webstorageIds.push(`${id}`);

        this.storage.setItem(`complay-${this.repositoryId()}-keys`, JSON.stringify(this.webstorageIds));
        this.storage.setItem(`complay-${this.repositoryId()}-${id}`, JSON.stringify(data));

        Object.defineProperty(repos, id, {
            enumerable: true,
            configurable: true,
            get: () => {
                return JSON.parse(this.storage.getItem(`complay-${this.repositoryId()}-${id}`));
            }
        });
    }

    removeRepositoryEntries() {
        this.webstorageIds.forEach(id => {
            this.storage.removeItem(`complay-${this.repositoryId()}-${id}`);
        });

        this.repository = {};
    }
}
