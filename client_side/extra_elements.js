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
class Menu extends HTMLElement {
    constructor(){
        super()
    }
    connectedCallback(){
        const eventoMouseEnter = new Event('mouseenter')
        this.addEventListener("mouseenter",()=>{
            if(this.parentElement!=null&&this.parentElement.tagName=="kl-submenu"){
                this.parentElement.style.display="block"
                this.style.display="block"
                this.parentElement.parentElement.dispatchEvent(eventoMouseEnter)
            }
        })
        this.addEventListener("mouseleave",()=>{
            if(this.parentElement!=null&&this.parentElement.tagName=="kl-submenu"){
                this.style.display="none"
                setTimeout(() => {
                    if(!this.parentElement.parentElement.mouse_inside){
                        this.parentElement.style.display="none"
                        this.style.display="none"
                    }
                }, 10)
            }
        })
        this.addEventListener("click",()=>{
            setTimeout(()=>{
                this.remove()
            },100)
        })
    }
    /**
     * 
     * @param {string} text 
     * @param {(event:MouseEvent)=>void} onclick 
     */
    add_option(text,onclick=(_e)=>{}){
        const node=document.createElement("kl-option")
        node.innerText=text
        node.addEventListener("click",onclick)
        this.appendChild(node)
    }
    /**
     * 
     * @param {string} text
     * @param {Menu} menu
     * @param {(event:MouseEvent)=>void} onclick
     */
    add_submenu(text,menu,onclick=(_e)=>{}){
        const node=document.createElement("kl-submenu")
        node.innerText=text
        node.addEventListener("click",onclick)
        node.appendChild(menu)
        this.appendChild(node)
    }
}
class SubMenu extends HTMLElement{
    constructor(){
        super()
        this.mouse_inside=false
        this.menu=null
    }
    connectedCallback(){
        this.addEventListener("mouseenter",()=>{
            this.menu=this.querySelector("kl-menu")
            this.mouse_inside=true
            this.menu.style.display="block"
        })
        this.addEventListener("mouseleave",()=>{
            this.mouse_inside=false
            this.menu.style.display="none"
        })
    }
}
customElements.define('tabs-container', TabsContainer)
customElements.define("kl-menu", Menu)
customElements.define("kl-submenu", SubMenu)