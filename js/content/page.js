import Component from "../component.js";
import Tab from "./components/page-tabs.js";

export default class Page extends Component{
    constructor({ element }) {
        super({ element });
        this._tabs = null;

        this._initTabs();

        this._tabs.forEach(tab => {
            tab.subscribe('tab-selected',
                ({ title, content }) => {
                    console.log('this is own eventSystem');
                    console.log(`Tab ${ title } was selected \n ${content}`);
                });

            tab.getElement().addEventListener('tab-selected', (event) => {
                let { title } = event.detail;
                console.log('this is built In eventSystem');
                console.log(title);
            })
        });

    }

    _initTabs() {
         let tabs = [...this._element.querySelectorAll('tabs')];

         this._tabs = tabs.map(tabsElement => {
            return new Tab({ element: tabsElement });
        });
    }
}