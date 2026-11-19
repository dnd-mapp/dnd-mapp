import{n as e}from"./rolldown-runtime-vtgMY1y5.js";import{N as t,P as n,c as r,n as i,s as a,x as o}from"./blocks-CDxrhzRn.js";import{i as s,n as c,r as l,t as u}from"./header.stories-CoTGTs4Z.js";function _createMdxContent(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(a,{of:l}),`
`,(0,d.jsx)(t.h1,{id:`header`,children:`Header`}),`
`,(0,d.jsx)(t.p,{children:`The bar at the top of every page. It is the Header component of the design system in Penpot. From the desktop breakpoint up, it holds the link home, the nav links, the GitHub button, and the Theme picker:`}),`
`,(0,d.jsx)(i,{of:u}),`
`,(0,d.jsx)(t.p,{children:`Below the breakpoint, it holds the link home and the Menu button, which opens Mobile menu:`}),`
`,(0,d.jsx)(i,{of:c}),`
`,(0,d.jsx)(t.h2,{id:`placing-a-header`,children:`Placing a header`}),`
`,(0,d.jsxs)(t.p,{children:[`Header is an attribute on `,(0,d.jsx)(t.code,{children:`<header>`}),`, so it is the banner of the page. Project the link home around a small logo, the nav links, and a quiet GitHub button, and open Mobile menu when the header emits `,(0,d.jsx)(t.code,{children:`menuPressed`}),`:`]}),`
`,(0,d.jsx)(t.pre,{children:(0,d.jsx)(t.code,{className:`language-html`,children:`<header dma-header (menuPressed)="mobileMenu.showModal()">
    <a routerLink="/"><dma-logo size="small" /></a>
    <a dma-nav-link routerLink="/compendium" aria-current="page">Compendium</a>
    <a dma-nav-link routerLink="/characters">Characters</a>
    <a dma-nav-link routerLink="/campaigns">Campaigns</a>
    <a dma-button kind="quiet" href="https://github.com/critsource/critsource"><dma-icon-github />GitHub</a>
</header>
`})}),`
`,(0,d.jsxs)(t.p,{children:[`The header places each child by its selector: an `,(0,d.jsx)(t.code,{children:`a[dma-nav-link]`}),` in its nav, an `,(0,d.jsx)(t.code,{children:`a[dma-button]`}),` at the end, and anything else, the link home, at the start. It draws the Theme picker and the Menu button itself. The header fills the width of the page, and keeps the inline padding of the page, from `,(0,d.jsx)(t.code,{children:`--space-page-inline`}),`.`]}),`
`,(0,d.jsx)(t.h2,{id:`layouts`,children:`Layouts`}),`
`,(0,d.jsxs)(t.p,{children:[`The layout follows the viewport, and switches at the desktop breakpoint, `,(0,d.jsx)(t.code,{children:`$breakpoint-desktop`}),` from `,(0,d.jsx)(t.code,{children:`@critsource/design-tokens/breakpoints.scss`}),`. Each layout hides the parts of the other, which also hides them from assistive technology. Below the breakpoint, Mobile menu holds the nav links, the GitHub button, and the Theme picker.`]}),`
`,(0,d.jsx)(t.h2,{id:`focus`,children:`Focus`}),`
`,(0,d.jsx)(t.p,{children:`The link home takes the size of the logo, and draws the focus ring of Link when it has keyboard focus, since Penpot draws no focus state for it. The nav links, the buttons, and the Theme picker draw their own focus states.`}),`
`,(0,d.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,d.jsx)(t.p,{children:`The header is the banner landmark of the page. The link home takes its name, "D&D Mapp", from the logo. The nav links sit in a navigation landmark named "Main". The Theme picker saves the choice of the reader itself, as it does wherever it sits.`}),`
`,(0,d.jsxs)(t.p,{children:[`The Menu button is named by its label, and sets `,(0,d.jsx)(t.code,{children:`aria-haspopup="dialog"`}),`, since Mobile menu is a modal dialog. It is 44 px tall, the minimum target size.`]}),`
`,(0,d.jsxs)(t.p,{children:[`The Menu button focuses itself when pressed, before the header emits `,(0,d.jsx)(t.code,{children:`menuPressed`}),`. Safari doesn't focus a button that the reader clicks or taps, so without it Mobile menu has no focus to return to when it closes. Mobile menu leaves the focus return to the browser.`]}),`
`,(0,d.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,d.jsxs)(t.p,{children:[(0,d.jsx)(t.code,{children:`HeaderHarness`}),` from `,(0,d.jsx)(t.code,{children:`@critsource/ui-web/testing`}),` reads a header in a test: its look and size, the logo in its link home, the `,(0,d.jsx)(t.code,{children:`NavLinkHarness`}),` of each nav link, the `,(0,d.jsx)(t.code,{children:`ButtonHarness`}),` of the GitHub button and of the Menu button, the `,(0,d.jsx)(t.code,{children:`ThemePickerHarness`}),` of its Theme picker, which parts the current layout shows, how far each part sits from the edges of the header, and the focus ring of the link home. `,(0,d.jsx)(t.code,{children:`pressMenu()`}),` presses the Menu button.`]}),`
`,(0,d.jsxs)(t.p,{children:[`A spec that renders a header provides a storage with `,(0,d.jsx)(t.code,{children:`provideBrowserStorage`}),`, so the Theme picker saves no choice in `,(0,d.jsx)(t.code,{children:`localStorage`}),`.`]})]})}function MDXContent(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,d.jsx)(t,{...e,children:(0,d.jsx)(_createMdxContent,{...e})}):_createMdxContent(e)}var d;function init_header(){return(init_header=e((()=>{d=o(),t(),r(),s()})))()}init_header();export{MDXContent as default};