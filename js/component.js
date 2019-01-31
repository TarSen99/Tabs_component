export default class Component {
    constructor({ element }) {
        this._element = element;
        this._callbacksMap = {};
    }

    on(eventName, selector, callback) {
        this._element.addEventListener(eventName, (e) => {
            if(!e.target.closest(selector)) {
                return;
            }

            callback(e);
        });
    }

    emit(eventName, data) {
        if(!this._callbacksMap[eventName]) {
            return;
        }

        for(let callback of this._callbacksMap[eventName]) {
            callback(data);
        }

        let event = new CustomEvent(eventName, {
            detail: data
        });

        this._element.dispatchEvent(event);
    }

    subscribe(eventName, callback) {
        if(!this._callbacksMap[eventName]) {
            this._callbacksMap[eventName] = [];
        }

        this._callbacksMap[eventName].push(callback);
    }
}
