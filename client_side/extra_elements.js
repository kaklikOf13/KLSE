class TabsContainer extends HTMLElement{
    constructor() {
        super();
        
    }
    connectedCallback() {
        const headerPosition = this.getAttribute('header-position') || 'top';
        this.classList.add(headerPosition);
        self.requestAnimationFrame(()=>{
            const d=document.createElement("div")
            d.innerHTML=this.innerHTML
            d.classList.add("tabs-content")
            this.innerHTML=""
            this.appendChild(d)
            this.tabs = this.querySelectorAll('tab');
            this.tabButtons = [];
            const tabsHeader = document.createElement("div")
            tabsHeader.classList.add("tabs-header")
            this.tabs.forEach((tab, index) => {
                const button = document.createElement('button');
                button.textContent = tab.getAttribute('text');
                button.classList.add('tab-button');
                if (index === 0) {
                    button.classList.add('tab-active');
                    tab.classList.add('tab-active');
                }
                button.addEventListener('click', () => {
                    this.switchTab(index);
                });
                tabsHeader.appendChild(button);
                this.tabButtons.push(button);
            });
            this.appendChild(tabsHeader)
        })
    }
    switchTab(index) {
        this.tabs.forEach((tab, i) => {
            tab.classList.toggle('tab-active', i === index);
        });
        this.tabButtons.forEach((button, i) => {
            button.classList.toggle('tab-active', i === index);
        });
    }
}

customElements.define('tabs-container', TabsContainer);