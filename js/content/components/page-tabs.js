import Component from "../../component.js";

export default class Tab extends Component {
  constructor({ element }) {
    super({ element });
    this._tabContents = [];
    this._tabTitles = [];

    this.on('click', '[data-element="tab-title"]', e => {
      let newTabWasSelected = this._selectNewTab(e);

      if(!newTabWasSelected) {
        return;
      }

      this.emit('tab-selected', {
        title: e.target.dataset.title,
        content: e.target.dataset.content
      });
    });

    this._render();
    this._getTabsTitlesList();
  }

  getCurrentTab() {
    let activeTabTitle = this._element.querySelector('.tab-header-active');

    return {
      title: activeTabTitle.dataset.title,
      content: activeTabTitle.dataset.content};
  }

  getElement() {
    return this._element;
  }

  _cleanTabsStyle() {
    this._tabTitles.forEach(tabTitle => {
      tabTitle.classList.remove('tab-header-active');
    });

    this._tabContents.forEach(tabTitle => {
      tabTitle.style.display = 'none';
    });
  }

  _checkIfCurrentTabIsSelected(tabTitle) {
    if(tabTitle.classList.contains('tab-header-active')) {
      return true;
    }

    return;
  }

  _selectNewTab(e) {
    let tabTitle = e.target.closest('[data-element="tab-title"]');
    let tabIsAlreadySelected = this._checkIfCurrentTabIsSelected(tabTitle);

    if(tabIsAlreadySelected) {
      return;
    }

    this._cleanTabsStyle();

    let tab = this._tabContents.find(tab => {
      return tab.dataset.elementId === tabTitle.dataset.elementId;
    });

    tabTitle.classList.add('tab-header-active');
    tab.style.display = 'block';

    return true;
  }

  _getTabsTitlesList() {
    this._tabTitles = [
      ...this._element.querySelectorAll('[data-element="tab-title"]')
    ];
  }

  _render() {
    this._setupTabsContentVisibility([...this._element.children]);
    this._renderTabsHeader(this._element);
  }

  _setupTabsContentVisibility(tabs) {
    tabs.forEach((tab, index) => {
      if (index > 0) {
        return;
      }

      tab.style.display = 'block';
    });
  }

  _renderTabsHeader(tabsElement) {
    let tabContents = [...tabsElement.querySelectorAll('tab')];
    this._tabContents = tabContents;

    let tabsTitles = tabContents.map((tab, index) => {
      let tabTitle = tab.title || 'No name';
      let tabContent = tab.textContent || 'no Content';
      tab.dataset.elementId = index;
      tab.dataset.element = 'tab-content';

      return { tabTitle, tabContent, index };
    });

    let tabsHeaderHTML = `<tabs-header>
            <ul>
                ${tabsTitles
                  .map((infoMap, index) => {
                    let currentClass =
                      'tab-header ' +
                      `${index === 0 ? 'tab-header-active' : ''}`;

                    return `<li data-title="${infoMap['tabTitle'].trim()}"
                        data-content="${infoMap['tabContent'].trim()}"
                        data-element='tab-title'
                        data-element-id="${infoMap['index']}"
                        class="${currentClass}"
                         >
                           ${infoMap['tabTitle']}
                     </li>`;
                  }).join('')}
            </ul>
        </tabs-header>`;

    tabsElement.insertAdjacentHTML('afterbegin', tabsHeaderHTML);
  }
}
