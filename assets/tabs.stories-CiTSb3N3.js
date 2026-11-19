import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{A as n,C as r,D as i,I as a,J as o,N as s,O as c,Q as l,R as u,T as d,Z as f,_ as p,b as m,g as h,h as g,j as _,mt as v,nt as y,pt as b,tt as x,w as S}from"./angular-platform-e5VfW5pO.js";import{r as C,t as w}from"./dist-B-70Eai5.js";import{x as T,y as E}from"./icon-sun.component-DF1-h-2U.js";import{t as D}from"./icon-C-gfMzhi.js";var O;function init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy90YWJzL3RhYi5jb21wb25lbnQuaHRtbA(){return(init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy90YWJzL3RhYi5jb21wb25lbnQuaHRtbA=e((()=>{O=`<ng-content />
<span class="indicator"></span>
`})))()}var k;function init_tab_component(){return(init_tab_component=e((()=>{k=`:host{box-sizing:border-box;height:var(--size-target-min);padding:0 var(--space-16);border-radius:var(--radius-sm);color:var(--color-foreground-muted);white-space:nowrap;cursor:pointer;font-family:var(--typography-nav-font-family);font-size:var(--typography-nav-font-size);font-weight:var(--typography-nav-font-weight);letter-spacing:var(--typography-nav-letter-spacing);line-height:var(--typography-nav-line-height);-webkit-text-decoration:var(--typography-nav-text-decoration);text-decoration:var(--typography-nav-text-decoration);text-transform:var(--typography-nav-text-case);background:0 0;border:none;flex:none;justify-content:center;align-items:center;margin:0;display:inline-flex;position:relative}.indicator{height:var(--size-indicator);background-color:var(--color-accent-text);display:none;position:absolute;inset:auto 0 0}:host([aria-selected=true]){color:var(--color-foreground-default)}:host([aria-selected=true]) .indicator{display:block}:host(:hover){background-color:var(--color-background-hover);color:var(--color-foreground-default)}:host(:focus-visible){outline:var(--border-width-focus) solid var(--color-focus-ring);outline-offset:var(--focus-offset)}`})))()}var A;function init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy90YWJzL3RhYi1saXN0LmNvbXBvbmVudC5odG1s(){return(init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy90YWJzL3RhYi1saXN0LmNvbXBvbmVudC5odG1s=e((()=>{A=`<div #tabs class="tabs" role="presentation" (scroll)="update()">
    <ng-content />
</div>
@if (scrollsStart()) {
    <button
        type="button"
        class="scroll-button start"
        tabindex="-1"
        aria-hidden="true"
        (mousedown)="$event.preventDefault()"
        (click)="scroll('start')"
    >
        <dma-icon-chevron-left />
    </button>
}
@if (scrollsEnd()) {
    <button
        type="button"
        class="scroll-button end"
        tabindex="-1"
        aria-hidden="true"
        (mousedown)="$event.preventDefault()"
        (click)="scroll('end')"
    >
        <dma-icon-chevron-right />
    </button>
}
`})))()}var j;function init_tab_list_component(){return(init_tab_list_component=e((()=>{j=`:host{margin:calc(-1 * calc(var(--border-width-focus) + var(--focus-offset)));background:linear-gradient(var(--color-border-divider), var(--color-border-divider)) left calc(var(--border-width-focus) + var(--focus-offset)) bottom calc(var(--border-width-focus) + var(--focus-offset))/calc(100% - 2 * calc(var(--border-width-focus) + var(--focus-offset))) var(--border-width-default) no-repeat;display:block;position:relative}.tabs{--hide-start:0px;--show-start:0px;--hide-end:0px;--show-end:0px;align-items:flex-end;column-gap:var(--space-4);scrollbar-width:none;padding:calc(var(--border-width-focus) + var(--focus-offset));scroll-padding-inline:calc(var(--border-width-focus) + var(--focus-offset));display:flex;overflow-x:auto}:host(.scrolls-start) .tabs{--hide-start:calc(calc(var(--border-width-focus) + var(--focus-offset)) + var(--size-target-min));--show-start:calc(calc(calc(var(--border-width-focus) + var(--focus-offset)) + var(--size-target-min)) + var(--space-16));scroll-padding-inline-start:calc(calc(calc(var(--border-width-focus) + var(--focus-offset)) + var(--size-target-min)) + var(--space-16))}:host(.scrolls-end) .tabs{--hide-end:calc(calc(var(--border-width-focus) + var(--focus-offset)) + var(--size-target-min));--show-end:calc(calc(calc(var(--border-width-focus) + var(--focus-offset)) + var(--size-target-min)) + var(--space-16));scroll-padding-inline-end:calc(calc(calc(var(--border-width-focus) + var(--focus-offset)) + var(--size-target-min)) + var(--space-16))}:host(.scrolls-start) .tabs,:host(.scrolls-end) .tabs{-webkit-mask-image:linear-gradient(to right, transparent var(--hide-start), black var(--show-start), black calc(100% - var(--show-end)), transparent calc(100% - var(--hide-end)));mask-image:linear-gradient(to right, transparent var(--hide-start), black var(--show-start), black calc(100% - var(--show-end)), transparent calc(100% - var(--hide-end)))}.scroll-button{top:calc(var(--border-width-focus) + var(--focus-offset));box-sizing:border-box;width:var(--size-target-min);height:var(--size-target-min);border-radius:var(--radius-sm);color:var(--color-foreground-muted);cursor:pointer;background:0 0;border:none;outline:none;justify-content:center;align-items:center;margin:0;padding:0;display:flex;position:absolute}.scroll-button.start{left:calc(var(--border-width-focus) + var(--focus-offset))}.scroll-button.end{right:calc(var(--border-width-focus) + var(--focus-offset))}.scroll-button:hover{background-color:var(--color-background-hover);color:var(--color-foreground-default)}`})))()}var M;function init_tabs_tokens(){return(init_tabs_tokens=e((()=>{r(),M=new o(`TAB`)})))()}function readScrollBehavior(){return matchMedia(`(prefers-reduced-motion: reduce)`).matches?`instant`:`smooth`}var N,P,F;function init_tab_list_component$1(){return(init_tab_list_component$1=e((()=>{v(),init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy90YWJzL3RhYi1saXN0LmNvbXBvbmVudC5odG1s(),init_tab_list_component(),r(),D(),init_tabs_tokens(),N={ArrowLeft:(e,t)=>(e-1+t)%t,ArrowRight:(e,t)=>(e+1)%t,Home:()=>0,End:(e,t)=>t-1},P=1,F=class TabListComponent{selected=d(0);tabs=m(M);tabElements=m(M,{read:s});scroller=i.required(`tabs`);scrollsStart=y(!1);scrollsEnd=y(!1);measured=y(!1);selectedTab=c(()=>{let e=this.tabs();return e[this.selected()]??e[0]??null});constructor(){p(e=>{let t=[this.scroller(),...this.tabElements()].map(e=>e.nativeElement),n=new ResizeObserver(()=>{this.update(),this.measured.set(!0)});for(let e of t)n.observe(e);e(()=>{n.disconnect()})});let e=!0;p(()=>{let t=this.selectedTab();this.measured()&&t&&(n(()=>{this.reveal(t,e?`instant`:readScrollBehavior())}),e=!1)})}select(e){let t=this.tabs().indexOf(e);t!==-1&&this.selected.set(t)}move(e){let t=N[e.key],n=this.tabs(),r=this.selectedTab();if(!t||!r||e.altKey||e.ctrlKey||e.metaKey)return;let i=n[t(n.indexOf(r),n.length)];i&&(e.preventDefault(),this.select(i),i.focus())}update(){let{scrollLeft:e,scrollWidth:t,clientWidth:n}=this.scroller().nativeElement;this.scrollsStart.set(e>P),this.scrollsEnd.set(t-n-e>P)}scroll(e){let{start:t,end:n}=this.readClearSpan(),r=this.tabElements().map(e=>e.nativeElement.getBoundingClientRect()),i=e===`start`?(r.findLast(e=>e.left<t-P)?.left??t)-t:(r.find(e=>e.right>n+P)?.right??n)-n;this.scroller().nativeElement.scrollBy({left:i,behavior:readScrollBehavior()})}reveal(e,t){let n=this.tabElements()[this.tabs().indexOf(e)]?.nativeElement;if(!n)return;let{start:r,end:i}=this.readClearSpan(),{left:a,right:o}=n.getBoundingClientRect(),s=a<r-P?a-r:o>i+P?Math.min(o-i,a-r):0;s!==0&&this.scroller().nativeElement.scrollBy({left:s,behavior:t})}readClearSpan(){let e=this.scroller().nativeElement,t=e.getBoundingClientRect(),{scrollPaddingLeft:n,scrollPaddingRight:r}=getComputedStyle(e);return{start:t.left+parseFloat(n),end:t.right-parseFloat(r)}}static ctorParameters=()=>[];static propDecorators={selected:[{type:a,args:[{isSignal:!0,alias:`selected`,required:!1}]},{type:u,args:[`selectedChange`]}],tabs:[{type:g,args:[M,{isSignal:!0}]}],tabElements:[{type:g,args:[M,{read:s,isSignal:!0}]}],scroller:[{type:h,args:[`tabs`,{isSignal:!0}]}]}},F=b([_({selector:`dma-tab-list`,template:A,imports:[T,E],host:{role:`tablist`,"[class.scrolls-start]":`scrollsStart()`,"[class.scrolls-end]":`scrollsEnd()`,"(keydown)":`move($event)`},styles:[j]})],F)})))()}var I,L;function init_tab_component$1(){return(init_tab_component$1=e((()=>{v(),init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy90YWJzL3RhYi5jb21wb25lbnQuaHRtbA(),init_tab_component(),r(),init_tab_list_component$1(),init_tabs_tokens(),I=0,L=class TabComponent{tabList=x(F);host=x(s);panel=S.required();id=`dma-tab-${(I++).toString()}`;selected=c(()=>this.tabList.selectedTab()===this);constructor(){f(e=>{let t=this.panel();t.tab.set(this),e(()=>{t.tab.set(null)})})}focus(){this.host.nativeElement.focus({preventScroll:!0})}select(){this.tabList.select(this)}static ctorParameters=()=>[];static propDecorators={panel:[{type:a,args:[{isSignal:!0,alias:`panel`,required:!0,transform:void 0}]}]}},L=b([_({selector:`button[dma-tab]`,template:O,providers:[{provide:M,useExisting:l(()=>L)}],host:{role:`tab`,type:`button`,"[id]":`id`,"[attr.aria-selected]":`selected()`,"[attr.aria-controls]":`panel().id`,"[attr.tabindex]":`selected() ? 0 : -1`,"(click)":`select()`},styles:[k]})],L)})))()}var R;function init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy90YWJzL3RhYi1wYW5lbC5jb21wb25lbnQuaHRtbA(){return(init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy90YWJzL3RhYi1wYW5lbC5jb21wb25lbnQuaHRtbA=e((()=>{R=`<ng-content />
`})))()}var z;function init_tab_panel_component(){return(init_tab_panel_component=e((()=>{z=`:host{display:block}:host([hidden]){display:none}:host(:focus-visible){outline:var(--border-width-focus) solid var(--color-focus-ring);outline-offset:var(--focus-offset)}`})))()}var B,V;function init_tab_panel_component$1(){return(init_tab_panel_component$1=e((()=>{v(),init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy90YWJzL3RhYi1wYW5lbC5jb21wb25lbnQuaHRtbA(),init_tab_panel_component(),r(),B=0,V=class TabPanelComponent{id=`dma-tab-panel-${(B++).toString()}`;tab=y(null);shown=c(()=>this.tab()?.selected()??!1)},V=b([_({selector:`dma-tab-panel`,template:R,host:{role:`tabpanel`,tabindex:`0`,"[id]":`id`,"[attr.aria-labelledby]":`tab()?.id ?? null`,"[hidden]":`!shown()`},styles:[z]})],V)})))()}var H=t({Default:()=>W,Focus:()=>q,Hover:()=>K,Overflow:()=>G,__namedExportsOrder:()=>J,default:()=>U}),U,W,G,K,q,J;function init_tabs_stories(){return(init_tabs_stories=e((()=>{w(),init_tab_component$1(),init_tab_list_component$1(),init_tab_panel_component$1(),U={title:`Patterns/Tabs`,component:F,subcomponents:{TabComponent:L,TabPanelComponent:V},argTypes:{selected:{description:`The index of the selected tab, which a click changes. An index without a tab selects the first.`,control:{type:`number`,min:0,step:1},table:{type:{summary:`number`},defaultValue:{summary:`0`}}}},parameters:{controls:{exclude:[`selectedTab`,`select`,`move`,`scrollsStart`,`scrollsEnd`,`update`,`scroll`]}},render:e=>({props:e,moduleMetadata:{imports:[L,V]},template:`
            <dma-tab-list aria-label="Character sheet" [(selected)]="selected">
                <button dma-tab [panel]="overview">Overview</button>
                <button dma-tab [panel]="stats">Stats</button>
                <button dma-tab [panel]="spells">Spells</button>
                <button dma-tab [panel]="notes">Notes</button>
            </dma-tab-list>
            <dma-tab-panel #overview><p>The class, level, and background of the character.</p></dma-tab-panel>
            <dma-tab-panel #stats><p>The six ability scores and their modifiers.</p></dma-tab-panel>
            <dma-tab-panel #spells><p>The spells the character knows, by level.</p></dma-tab-panel>
            <dma-tab-panel #notes><p>Whatever the player wants to remember.</p></dma-tab-panel>
        `})},W={args:{selected:0}},G={args:{selected:0,moreTabs:!0},argTypes:{moreTabs:{description:`Whether the list holds the Inventory and Features tabs, which no longer fit beside the rest.`,control:{type:`boolean`},table:{type:{summary:`boolean`}}}},decorators:[C(e=>`<div style="max-width: 360px">${e}</div>`)],render:e=>({props:e,moduleMetadata:{imports:[L,V]},template:`
            <dma-tab-list aria-label="Character sheet" [(selected)]="selected">
                <button dma-tab [panel]="overview">Overview</button>
                <button dma-tab [panel]="stats">Stats</button>
                <button dma-tab [panel]="spells">Spells</button>
                @if (moreTabs) {
                    <button dma-tab [panel]="inventory">Inventory</button>
                    <button dma-tab [panel]="features">Features</button>
                }
                <button dma-tab [panel]="notes">Notes</button>
            </dma-tab-list>
            <dma-tab-panel #overview><p>The class, level, and background of the character.</p></dma-tab-panel>
            <dma-tab-panel #stats><p>The six ability scores and their modifiers.</p></dma-tab-panel>
            <dma-tab-panel #spells><p>The spells the character knows, by level.</p></dma-tab-panel>
            <dma-tab-panel #inventory><p>What the character carries.</p></dma-tab-panel>
            <dma-tab-panel #features><p>The class features of the character.</p></dma-tab-panel>
            <dma-tab-panel #notes><p>Whatever the player wants to remember.</p></dma-tab-panel>
        `})},K={args:{selected:0},parameters:{pseudo:{hover:[`button[dma-tab]:nth-child(2)`]}}},q={args:{selected:0},parameters:{pseudo:{focusVisible:[`button[dma-tab]:nth-child(1)`]}}},J=[`Default`,`Overflow`,`Hover`,`Focus`],W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    selected: 0
  }
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    selected: 0,
    moreTabs: true
  },
  argTypes: {
    moreTabs: {
      description: 'Whether the list holds the Inventory and Features tabs, which no longer fit beside the rest.',
      control: {
        type: 'boolean'
      },
      table: {
        type: {
          summary: 'boolean'
        }
      }
    }
  },
  decorators: [componentWrapperDecorator(story => \`<div style="max-width: 360px">\${story}</div>\`)],
  render: args => ({
    props: args,
    moduleMetadata: {
      imports: [TabComponent, TabPanelComponent]
    },
    template: \`
            <dma-tab-list aria-label="Character sheet" [(selected)]="selected">
                <button dma-tab [panel]="overview">Overview</button>
                <button dma-tab [panel]="stats">Stats</button>
                <button dma-tab [panel]="spells">Spells</button>
                @if (moreTabs) {
                    <button dma-tab [panel]="inventory">Inventory</button>
                    <button dma-tab [panel]="features">Features</button>
                }
                <button dma-tab [panel]="notes">Notes</button>
            </dma-tab-list>
            <dma-tab-panel #overview><p>The class, level, and background of the character.</p></dma-tab-panel>
            <dma-tab-panel #stats><p>The six ability scores and their modifiers.</p></dma-tab-panel>
            <dma-tab-panel #spells><p>The spells the character knows, by level.</p></dma-tab-panel>
            <dma-tab-panel #inventory><p>What the character carries.</p></dma-tab-panel>
            <dma-tab-panel #features><p>The class features of the character.</p></dma-tab-panel>
            <dma-tab-panel #notes><p>Whatever the player wants to remember.</p></dma-tab-panel>
        \`
  })
}`,...G.parameters?.docs?.source},description:{story:"Tabs too wide for their container: the tab list scrolls sideways, and shows a scroll button at each end that has more\ntabs. A click on one scrolls the next tab into view. Set `selected` to a tab past the edge, such as 4 for Features, and\nthe list scrolls it fully into view, as it does for a click on a tab or a key. Turn off `moreTabs` to remove two tabs,\nso the rest fit and the buttons hide.",...G.parameters?.docs?.description}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    selected: 0
  },
  parameters: {
    pseudo: {
      hover: ['button[dma-tab]:nth-child(2)']
    }
  }
}`,...K.parameters?.docs?.source},description:{story:`The pointer over Stats: the tab fills its box, and its label turns to the default color.`,...K.parameters?.docs?.description}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    selected: 0
  },
  parameters: {
    pseudo: {
      focusVisible: ['button[dma-tab]:nth-child(1)']
    }
  }
}`,...q.parameters?.docs?.source},description:{story:`Keyboard focus on the selected tab: the focus ring outside the tab, which keeps its selected look.`,...q.parameters?.docs?.description}}}})))()}export{init_tabs_stories as a,G as i,q as n,H as o,K as r,W as t};