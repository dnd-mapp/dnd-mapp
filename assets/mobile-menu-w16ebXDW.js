import{n as e}from"./rolldown-runtime-vtgMY1y5.js";import{N as t,P as n,c as r,n as i,s as a,x as o}from"./blocks-CDxrhzRn.js";import{i as s,n as c,r as l,t as u}from"./mobile-menu.stories-iO5opf-X.js";function _createMdxContent(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(a,{of:s}),`
`,(0,d.jsx)(t.h1,{id:`mobile-menu`,children:`Mobile menu`}),`
`,(0,d.jsx)(t.p,{children:`The navigation of every page below the desktop breakpoint, which the Menu button of Header opens. It is the Mobile menu component of the design system in Penpot. It covers the viewport, with the link home and a Close button in the bar of Header at the top, and below it the nav links as rows, the GitHub button, and the Theme picker:`}),`
`,(0,d.jsx)(i,{of:u,story:{inline:!1,height:`812px`}}),`
`,(0,d.jsx)(t.h2,{id:`placing-a-menu`,children:`Placing a menu`}),`
`,(0,d.jsxs)(t.p,{children:[`Mobile menu is an attribute on `,(0,d.jsx)(t.code,{children:`<dialog>`}),`. Place it next to Header, project the link home around a small logo, the nav links as rows, and a quiet GitHub button, and open it with `,(0,d.jsx)(t.code,{children:`showModal()`}),` when the header emits `,(0,d.jsx)(t.code,{children:`menuPressed`}),`:`]}),`
`,(0,d.jsx)(t.pre,{children:(0,d.jsx)(t.code,{className:`language-html`,children:`<header dma-header (menuPressed)="mobileMenu.showModal()">…</header>
<dialog dma-mobile-menu #mobileMenu>
    <a routerLink="/"><dma-logo size="small" /></a>
    <a dma-nav-link kind="row" routerLink="/compendium" aria-current="page">Compendium</a>
    <a dma-nav-link kind="row" routerLink="/characters">Characters</a>
    <a dma-nav-link kind="row" routerLink="/campaigns">Campaigns</a>
    <a dma-button kind="quiet" href="https://github.com/critsource/critsource"><dma-icon-github />GitHub</a>
</dialog>
`})}),`
`,(0,d.jsxs)(t.p,{children:[`A template reference points at the component rather than the `,(0,d.jsx)(t.code,{children:`<dialog>`}),`, so the component passes `,(0,d.jsx)(t.code,{children:`showModal()`}),` and `,(0,d.jsx)(t.code,{children:`close()`}),` on to the dialog. The browser keeps the state in the `,(0,d.jsx)(t.code,{children:`open`}),` attribute, and fires the native `,(0,d.jsx)(t.code,{children:`close`}),` event each time the menu closes, so Mobile menu has no inputs or outputs of its own. The menu knows no router, so a page that navigates from a nav link closes the menu itself, for example with `,(0,d.jsx)(t.code,{children:`(click)="mobileMenu.close()"`}),`.`]}),`
`,(0,d.jsxs)(t.p,{children:[`The menu places each child by its selector: an `,(0,d.jsx)(t.code,{children:`a[dma-nav-link]`}),` in its nav, an `,(0,d.jsx)(t.code,{children:`a[dma-button]`}),` after the nav, and anything else, the link home, at the start of its bar. It draws the Close button and the Theme picker itself, since every page shows them the same. Below the nav, the GitHub button and the Theme picker fill the width of the menu, and the options of the picker share it equally.`]}),`
`,(0,d.jsx)(t.p,{children:`Press Menu to open the menu below Header, and Close or Escape to close it:`}),`
`,(0,d.jsx)(i,{of:c,story:{inline:!1,height:`812px`}}),`
`,(0,d.jsx)(t.h2,{id:`opening-and-closing`,children:`Opening and closing`}),`
`,(0,d.jsx)(t.p,{children:`The menu is a modal dialog, so the browser does most of the work:`}),`
`,(0,d.jsxs)(t.ul,{children:[`
`,(0,d.jsx)(t.li,{children:`Opening moves focus to the Close button, as Penpot asks, rather than to the link home before it.`}),`
`,(0,d.jsx)(t.li,{children:`While the menu is open, the page behind is inert: Tab moves between the links and buttons of the menu only. The page behind stops scrolling too, and a scroll inside the menu stops at its edge.`}),`
`,(0,d.jsx)(t.li,{children:`Close and Escape close the menu, and the browser returns focus to the element that had it before the menu opened, the Menu button.`}),`
`]}),`
`,(0,d.jsxs)(t.p,{children:[`The menu also closes itself when the window grows to the desktop breakpoint, since Header shows its desktop nav from there, and the page behind is usable again. The native `,(0,d.jsx)(t.code,{children:`close`}),` event fires then too. The menu reads the breakpoint from `,(0,d.jsx)(t.code,{children:`@critsource/design-tokens/breakpoints`}),` and watches it in the browser only, so prerendering leaves it alone.`]}),`
`,(0,d.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,d.jsx)(t.p,{children:`The menu is a dialog named "Menu". The link home takes its name, "D&D Mapp", from the logo. The nav links sit in a navigation landmark named "Main", as in Header; the header is inert while the menu is open, so only one of them is exposed at a time.`}),`
`,(0,d.jsx)(t.p,{children:`The Close button is named by its label, and is 44 px tall, the minimum target size.`}),`
`,(0,d.jsx)(t.p,{children:`The Theme picker is a group named "Theme" by its legend. The visible Theme title above it is hidden from assistive technology, so the name isn't read twice.`}),`
`,(0,d.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,d.jsxs)(t.p,{children:[(0,d.jsx)(t.code,{children:`MobileMenuHarness`}),` from `,(0,d.jsx)(t.code,{children:`@critsource/ui-web/testing`}),` reads a menu in a test: whether it is open and modal, its look and place in the viewport, the logo in its link home, the `,(0,d.jsx)(t.code,{children:`ButtonHarness`}),` of its Close button, the look of its bar, and how far each part of the bar sits from the edges of the menu. For the body, it reads the `,(0,d.jsx)(t.code,{children:`NavLinkHarness`}),` of each row, the `,(0,d.jsx)(t.code,{children:`ButtonHarness`}),` of the GitHub button, the `,(0,d.jsx)(t.code,{children:`ThemePickerHarness`}),`, the look of the divider and the Theme title, and where each part sits in the menu. `,(0,d.jsx)(t.code,{children:`pressClose()`}),` presses the Close button.`]})]})}function MDXContent(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,d.jsx)(t,{...e,children:(0,d.jsx)(_createMdxContent,{...e})}):_createMdxContent(e)}var d;function init_mobile_menu(){return(init_mobile_menu=e((()=>{d=o(),t(),r(),l()})))()}init_mobile_menu();export{MDXContent as default};