import Component from "../../component.js";

export default class Tab extends Component {
  constructor({ element }) {
    super({ element });
    this._tabs = null;
    this._tabTitles = null;

    this.on("click", '[data-element="tab-title"]', e => {
      this._selectNewTab(e);
      this.emit("tab-selected", {
        title: e.target.dataset.title,
        content: e.target.dataset.content
      });
    });

    this._render();
    this._getTabsTitlesList();
  }

  getElement() {
    return this._element;
  }

  _cleanTabsStyle() {
    this._tabTitles.forEach(tabTitle => {
      tabTitle.classList.remove("tab-header-active");
    });

    this._tabs.forEach(tabTitle => {
      tabTitle.style.display = "none";
    });
  }

  _selectNewTab(e) {
    this._cleanTabsStyle();
    let tabTitle = e.target.closest('[data-element="tab-title"]');

    let tab = this._tabs.find(tab => {
      return tab.dataset.elementId === tabTitle.dataset.elementId;
    });

    tabTitle.classList.add("tab-header-active");
    tab.style.display = "block";
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

      tab.style.display = "block";
    });
  }

  _renderTabsHeader(tabsElement) {
    let tabs = [...tabsElement.querySelectorAll("tab")];
    this._tabs = tabs;

    let tabsTitles = tabs.map((tab, index) => {
      let tabTitle = tab.title || "No name";
      let tabContent = tab.textContent || "no Content";
      tab.dataset.elementId = index;
      tab.dataset.element = "tab-content";

      return { tabTitle, tabContent, index };
    });

    let tabsHeaderHTML = `<tabs-header>
            <ul>
                ${tabsTitles
                  .map((infoMap, index) => {
                    let currentClass =
                      "tab-header " +
                      `${index === 0 ? "tab-header-active" : ""}`;

                    return `<li data-title="${infoMap["tabTitle"].trim()}"
                        data-content="${infoMap["tabContent"].trim()}"
                        data-element="tab-title"
                        data-element-id="${infoMap["index"]}"
                        class="${currentClass}"
                         >
                           ${infoMap["tabTitle"]}
                     </li>`;
                  })
                  .join("")}
            </ul>
        </tabs-header>`;

    tabsElement.insertAdjacentHTML("afterbegin", tabsHeaderHTML);
  }
}
