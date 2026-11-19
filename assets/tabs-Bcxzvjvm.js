import{n as e}from"./rolldown-runtime-vtgMY1y5.js";import{N as t,P as n,c as r,i,n as a,s as o,x as s}from"./blocks-CDxrhzRn.js";import{a as c,i as l,n as u,o as d,r as f,t as p}from"./tabs.stories-CiTSb3N3.js";function _createMdxContent(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:d}),`
`,(0,m.jsx)(t.h1,{id:`tabs`,children:`Tabs`}),`
`,(0,m.jsx)(t.p,{children:`Switches between views of the same content, such as the parts of a character sheet, without leaving the page. It is the Tab list and Tab components of the design system in Penpot, with a panel for the content of each tab. To move between pages, use Nav link instead.`}),`
`,(0,m.jsx)(a,{of:p}),`
`,(0,m.jsx)(i,{of:p}),`
`,(0,m.jsx)(t.h2,{id:`placing-tabs`,children:`Placing tabs`}),`
`,(0,m.jsxs)(t.p,{children:[`Put a `,(0,m.jsx)(t.code,{children:`button[dma-tab]`}),` in a `,(0,m.jsx)(t.code,{children:`dma-tab-list`}),` for each view, and a `,(0,m.jsx)(t.code,{children:`dma-tab-panel`}),` for its content wherever the page needs it. Each tab names its panel through a template reference. Name the tab list with `,(0,m.jsx)(t.code,{children:`aria-label`}),`, or with `,(0,m.jsx)(t.code,{children:`aria-labelledby`}),` when a heading on the page names it:`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-html`,children:`<dma-tab-list aria-label="Character sheet">
    <button dma-tab [panel]="stats">Stats</button>
    <button dma-tab [panel]="spells">Spells</button>
</dma-tab-list>
<dma-tab-panel #stats>…</dma-tab-panel>
<dma-tab-panel #spells>…</dma-tab-panel>
`})}),`
`,(0,m.jsxs)(t.p,{children:[`The tab list keeps which tab is selected, and starts on the first. `,(0,m.jsx)(t.code,{children:`selected`}),` holds the index of the selected tab: bind it to start on another tab, or two-way to follow the selection, as in `,(0,m.jsx)(t.code,{children:`[(selected)]="index"`}),`. An index without a tab selects the first.`]}),`
`,(0,m.jsx)(t.p,{children:`Each tab links itself to its panel, so the page writes no ids or ARIA attributes. A panel shows only while its tab is selected, and a panel that no tab names stays hidden. A hidden panel stays in the page, so its content keeps its state, such as a scroll position or a form, across a switch of tabs.`}),`
`,(0,m.jsx)(t.h2,{id:`tab-list`,children:`Tab list`}),`
`,(0,m.jsx)(t.p,{children:`The tab list fills its container, with its tabs side by side, each as wide as its label, and draws a divider along its bottom edge.`}),`
`,(0,m.jsx)(t.p,{children:`When the tabs do not fit, the tab list scrolls sideways. It draws no scrollbar, which would add to its height and cover the divider: a swipe, Shift with the mouse wheel, a scroll button, or the keys that move between the tabs scroll it.`}),`
`,(0,m.jsx)(a,{of:l}),`
`,(0,m.jsx)(t.p,{children:`A list that scrolls clips what it draws outside its box, so the tab list reaches 4 px past its container on each side, the room of the focus ring of a tab, and pads that room back. It still takes the height of a tab in the page. Leave that room unclipped around the tab list, so the focus ring shows whole.`}),`
`,(0,m.jsx)(t.h3,{id:`selected-tab-in-view`,children:`Selected tab in view`}),`
`,(0,m.jsxs)(t.p,{children:[`The selected tab always scrolls fully into view, clear of the fades and with the room of its focus ring: when the list starts, when the page changes `,(0,m.jsx)(t.code,{children:`selected`}),`, on a click, and on a key. The list scrolls the least distance that shows the tab whole, and leaves a tab that already shows whole where it is. It scrolls only itself, never the page, and leaves the focus where it was.`]}),`
`,(0,m.jsx)(t.p,{children:`The scroll on start is instant. Every later scroll is smooth, and instant when the reader prefers reduced motion. The list scrolls only when the selection changes, so a resize, or tabs that are added, removed, or change width, leave the tabs where they are.`}),`
`,(0,m.jsx)(t.h3,{id:`fades`,children:`Fades`}),`
`,(0,m.jsx)(t.p,{children:`The tab list fades its tabs out at each end that has more tabs past it, and draws no fade while its tabs fit. At that end, the tabs hide under the scroll button and the room of the focus ring, and fade in over the next 16 px. The fades follow the list as it scrolls, as its container resizes, and as tabs are added, removed, or change width. They leave the tabs where they are.`}),`
`,(0,m.jsx)(t.h3,{id:`scroll-buttons`,children:`Scroll buttons`}),`
`,(0,m.jsx)(t.p,{children:`The tab list shows a scroll button over each end that has more tabs past it, with a chevron that points the way it scrolls, and none while its tabs fit. A click scrolls until the next tab past that end shows whole. The scroll is smooth, and instant when the reader prefers reduced motion. The buttons follow the list as it scrolls, as its container resizes, and as tabs are added, removed, or change width.`}),`
`,(0,m.jsx)(t.p,{children:`Each button is 44 px square, the minimum target size, and lies over its end of the list, so the tabs stay where they are as it shows and hides. It draws the quiet look: no fill or border, and a chevron in the muted text color. Hover fills it, and turns the chevron to the default text color, as it does a tab.`}),`
`,(0,m.jsx)(t.p,{children:`The buttons are for the pointer, and work the same with a mouse, a pen, or touch. They stay out of the tab order and the accessibility tree, since the keys reach every tab, and a press on one leaves the focus where it was. They draw no focus ring, since they take no focus.`}),`
`,(0,m.jsx)(t.h2,{id:`tab`,children:`Tab`}),`
`,(0,m.jsx)(t.h3,{id:`default`,children:`Default`}),`
`,(0,m.jsx)(t.p,{children:`A tab shows its label in the muted text color.`}),`
`,(0,m.jsx)(t.h3,{id:`selected`,children:`Selected`}),`
`,(0,m.jsx)(t.p,{children:`The selected tab shows its label in the default text color, and draws the indicator in the accent color along its bottom edge, over the divider, so the selection never relies on the text color alone. A click selects a tab.`}),`
`,(0,m.jsx)(t.h3,{id:`hover`,children:`Hover`}),`
`,(0,m.jsx)(t.p,{children:`A tab fills its box, and shows its label in the default text color. The selected tab keeps its indicator.`}),`
`,(0,m.jsx)(a,{of:f}),`
`,(0,m.jsx)(t.h3,{id:`focus`,children:`Focus`}),`
`,(0,m.jsx)(t.p,{children:`A tab draws the focus ring outside itself on keyboard focus, and keeps the look of its state. A click draws no ring.`}),`
`,(0,m.jsx)(a,{of:u}),`
`,(0,m.jsx)(t.h2,{id:`keyboard`,children:`Keyboard`}),`
`,(0,m.jsx)(t.p,{children:`The tabs activate automatically, as the ARIA Authoring Practices Guide describes for panels whose content shows without delay: the keys that move between the tabs also select them.`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.strong,{children:`Right arrow`}),` moves to and selects the next tab, or the first tab from the last.`]}),`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.strong,{children:`Left arrow`}),` moves to and selects the previous tab, or the last tab from the first.`]}),`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.strong,{children:`Home`}),` and `,(0,m.jsx)(t.strong,{children:`End`}),` move to and select the first and the last tab.`]}),`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.strong,{children:`Tab`}),` leaves the tab list for the panel of the selected tab.`]}),`
`]}),`
`,(0,m.jsx)(t.p,{children:`A key pressed with Alt, Ctrl, or Meta stays with the browser, so Alt with the left arrow still goes back a page.`}),`
`,(0,m.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,m.jsxs)(t.p,{children:[`The tab list, each tab, and each panel take the `,(0,m.jsx)(t.code,{children:`tablist`}),`, `,(0,m.jsx)(t.code,{children:`tab`}),`, and `,(0,m.jsx)(t.code,{children:`tabpanel`}),` roles. The selected tab carries `,(0,m.jsx)(t.code,{children:`aria-selected="true"`}),`, each tab points at its panel through `,(0,m.jsx)(t.code,{children:`aria-controls`}),`, and each panel takes its name from its tab through `,(0,m.jsx)(t.code,{children:`aria-labelledby`}),`. Only the selected tab is in the tab order, and the panel follows it, so Tab moves from the tab list into the panel, which draws the focus ring outside itself as the tabs do.`]}),`
`,(0,m.jsxs)(t.p,{children:[`Each tab is 44 px tall, the minimum target size, and is a `,(0,m.jsx)(t.code,{children:`<button type="button">`}),`, so it submits no form it sits in.`]}),`
`,(0,m.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`TabListHarness`}),` from `,(0,m.jsx)(t.code,{children:`@critsource/ui-web/testing`}),` reads a tab list in a test: its tabs and their labels, the labels of the selected and the focused tab, whether it scrolls and which tabs and focus rings show within it, which tabs show clear of its scroll buttons, which ends show a scroll button and where, its fades, its size, the gap between its tabs, and its divider. `,(0,m.jsx)(t.code,{children:`TabListScrollButtonHarness`}),` reads each scroll button: its end, its chevron, its look, its `,(0,m.jsx)(t.code,{children:`type`}),`, `,(0,m.jsx)(t.code,{children:`tabindex`}),`, and `,(0,m.jsx)(t.code,{children:`aria-hidden`}),`; `,(0,m.jsx)(t.code,{children:`click()`}),` scrolls the list. `,(0,m.jsx)(t.code,{children:`TabHarness`}),` reads each tab: its label, whether it is selected or focused, its id, `,(0,m.jsx)(t.code,{children:`aria-controls`}),`, and `,(0,m.jsx)(t.code,{children:`tabindex`}),`, and its look, box, size, indicator, and focus ring; `,(0,m.jsx)(t.code,{children:`click()`}),` selects it, `,(0,m.jsx)(t.code,{children:`focus()`}),` focuses it so a test can press keys from it, and `,(0,m.jsx)(t.code,{children:`TabHarness.with({ label })`}),` finds the tab of a label. `,(0,m.jsx)(t.code,{children:`TabPanelHarness`}),` reads each panel: its text, whether it shows or has the focus, its focus ring, its id, `,(0,m.jsx)(t.code,{children:`aria-labelledby`}),`, and `,(0,m.jsx)(t.code,{children:`tabindex`}),`.`]})]})}function MDXContent(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(_createMdxContent,{...e})}):_createMdxContent(e)}var m;function init_tabs(){return(init_tabs=e((()=>{m=s(),t(),r(),c()})))()}init_tabs();export{MDXContent as default};