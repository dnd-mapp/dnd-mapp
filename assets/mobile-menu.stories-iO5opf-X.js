import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{C as n,H as r,N as i,U as a,j as o,mt as s,pt as c,q as l,tt as u}from"./angular-platform-e5VfW5pO.js";import{a as d,t as f}from"./dist-B-70Eai5.js";import{t as p}from"./button.component-C24ZEmEz.js";import{_ as m,p as h}from"./icon-sun.component-DF1-h-2U.js";import{t as g}from"./icon-C-gfMzhi.js";import{t as _}from"./logo.component-gtw5vJTP.js";import{n as v,t as y}from"./theme-picker-C3D1BOT2.js";import{o as b,r as x,t as S}from"./theme-picker.component-Bk-ZepiW.js";import{n as C,t as w}from"./theme--WByyVV1.js";import{n as T,r as E,t as D}from"./header.component-DlUPnaqB.js";import{t as O}from"./nav-link.component-vrSCSt3S.js";import{t as k}from"./nav-link-B7o1wdw_.js";var A;function init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy9tb2JpbGUtbWVudS9tb2JpbGUtbWVudS5jb21wb25lbnQuaHRtbA(){return(init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy9tb2JpbGUtbWVudS9tb2JpbGUtbWVudS5jb21wb25lbnQuaHRtbA=e((()=>{A=`<div class="bar">
    <ng-content />
    <!-- The browser focuses Close when the menu opens, as Penpot asks, rather than the link home before it. The rule
         guards against autofocus on page load, while the HTML spec picks the focus of an opening dialog this way. -->
    <!-- eslint-disable-next-line @angular-eslint/template/no-autofocus -- A dialog picks its focus by autofocus. -->
    <button dma-button type="button" kind="quiet" class="close" autofocus (click)="close()">
        <dma-icon-close />
        Close
    </button>
</div>
<div class="body">
    <nav aria-label="Main">
        <ng-content select="a[dma-nav-link]" />
    </nav>
    <ng-content select="a[dma-button]" />
    <div class="theme">
        <!-- The legend of the picker names the group for assistive technology, so the title isn't read twice. -->
        <p class="title" aria-hidden="true">Theme</p>
        <fieldset dma-theme-picker></fieldset>
    </div>
</div>
`})))()}var j;function init_mobile_menu_component(){return(init_mobile_menu_component=e((()=>{j=`dialog[dma-mobile-menu]{box-sizing:border-box;background:var(--color-background-page);block-size:100%;max-block-size:none;inline-size:100%;max-inline-size:none;color:var(--color-foreground-default);overscroll-behavior:contain;border:0;margin:0;padding:0;inset:0;overflow-y:auto}dialog[dma-mobile-menu][open]{flex-direction:column;display:flex}:root:has(dialog[dma-mobile-menu]:modal){overflow:hidden}dialog[dma-mobile-menu]>.bar{box-sizing:border-box;padding:var(--space-12) var(--space-page-inline) calc(var(--space-12) - var(--border-width-default));border-block-end:var(--border-width-default) solid var(--color-border-divider);flex:none;justify-content:space-between;align-items:center;display:flex}dialog[dma-mobile-menu]>.bar>a{border-radius:var(--radius-xs);text-decoration:none;display:flex}dialog[dma-mobile-menu]>.bar>a:focus-visible{outline:var(--border-width-focus) solid var(--color-focus-ring);outline-offset:var(--focus-offset)}dialog[dma-mobile-menu]>.body{gap:var(--space-24);padding:var(--space-16) var(--space-page-inline) var(--space-24);flex-direction:column;display:flex}dialog[dma-mobile-menu]>.body>nav{gap:var(--space-4);border-block-end:var(--border-width-default) solid var(--color-border-divider);flex-direction:column;padding-block-end:var(--space-24);display:flex}dialog[dma-mobile-menu]>.body>.theme{gap:var(--space-12);flex-direction:column;display:flex}dialog[dma-mobile-menu]>.body>.theme>.title{color:var(--color-foreground-default);font-family:var(--typography-caps-font-family);font-size:var(--typography-caps-font-size);font-weight:var(--typography-caps-font-weight);letter-spacing:var(--typography-caps-letter-spacing);line-height:var(--typography-caps-line-height);-webkit-text-decoration:var(--typography-caps-text-decoration);text-decoration:var(--typography-caps-text-decoration);text-transform:var(--typography-caps-text-case);margin:0}dialog[dma-mobile-menu]>.body>.theme>[dma-theme-picker]{display:flex}dialog[dma-mobile-menu]>.body>.theme>[dma-theme-picker]>dma-theme-option{flex:1 1 0}`})))()}var M;function init_breakpoints(){return(init_breakpoints=e((()=>{M=`64em`})))()}var N;function init_mobile_menu_component$1(){return(init_mobile_menu_component$1=e((()=>{s(),init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy9tb2JpbGUtbWVudS9tb2JpbGUtbWVudS5jb21wb25lbnQuaHRtbA(),init_mobile_menu_component(),n(),init_breakpoints(),E(),g(),y(),N=class MobileMenuComponent{dialog=u(i).nativeElement;constructor(){let e=u(l);a(()=>{let t=matchMedia(`(min-width: ${M})`),onChange=({matches:e})=>{e&&this.dialog.close()};t.addEventListener(`change`,onChange),e.onDestroy(()=>{t.removeEventListener(`change`,onChange)})})}showModal(){this.dialog.showModal()}close(){this.dialog.close()}static ctorParameters=()=>[]},N=c([o({selector:`dialog[dma-mobile-menu]`,template:A,encapsulation:r.None,imports:[p,m,S],host:{"aria-label":`Menu`},styles:[j]})],N)})))()}function init_header(){return(init_header=e((()=>{T()})))()}var P=t({Open:()=>L,WithHeader:()=>R,__namedExportsOrder:()=>z,default:()=>I}),F,I,L,R,z;function init_mobile_menu_stories(){return(init_mobile_menu_stories=e((()=>{f(),init_mobile_menu_component$1(),w(),x(),E(),init_header(),g(),v(),k(),F=`
    <a href="#"><dma-logo size="small" /></a>
    <a dma-nav-link kind="row" href="#" aria-current="page">Compendium</a>
    <a dma-nav-link kind="row" href="#">Characters</a>
    <a dma-nav-link kind="row" href="#">Campaigns</a>
    <a dma-button kind="quiet" href="#"><dma-icon-github />GitHub</a>
`,I={title:`Regions/Mobile menu`,component:N,decorators:[d({imports:[D,_,O,p,h]}),C(b.System)],parameters:{layout:`fullscreen`},globals:{viewport:{value:`mobile1`,isRotated:!1}}},L={render:()=>({template:`<dialog dma-mobile-menu>${F}</dialog>`}),play:({canvasElement:e})=>{e.querySelector(`dialog[dma-mobile-menu]`)?.showModal()}},R={render:()=>({template:`
            <header dma-header (menuPressed)="mobileMenu.showModal()">
                <a href="#"><dma-logo size="small" /></a>
            </header>
            <dialog dma-mobile-menu #mobileMenu>${F}</dialog>
        `})},z=[`Open`,`WithHeader`],L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: () => ({
    template: \`<dialog dma-mobile-menu>\${content}</dialog>\`
  }),
  play: ({
    canvasElement
  }) => {
    canvasElement.querySelector<HTMLDialogElement>('dialog[dma-mobile-menu]')?.showModal();
  }
}`,...L.parameters?.docs?.source},description:{story:`The menu open over the page, as the Menu button of Header leaves it. The docs page shows the story in an iframe, so
the modal covers the story rather than the docs page.`,...L.parameters?.docs?.description}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: () => ({
    template: \`
            <header dma-header (menuPressed)="mobileMenu.showModal()">
                <a href="#"><dma-logo size="small" /></a>
            </header>
            <dialog dma-mobile-menu #mobileMenu>\${content}</dialog>
        \`
  })
}`,...R.parameters?.docs?.source},description:{story:`The closed menu below Header. Press Menu to open it, and Close or Escape to close it again.`,...R.parameters?.docs?.description}}}})))()}export{P as i,R as n,init_mobile_menu_stories as r,L as t};