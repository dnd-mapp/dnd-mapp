import{n as e}from"./rolldown-runtime-vtgMY1y5.js";import{N as t,P as n,c as r,i,n as a,s as o,x as s}from"./blocks-CDxrhzRn.js";import{a as c,c as l,d as u,i as d,l as f,n as p,o as m,r as h,s as g,t as _,u as v}from"./on-this-page.stories-CsP-QM6f.js";function _createMdxContent(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,...n(),...e.components};return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(o,{of:u}),`
`,(0,y.jsx)(t.h1,{id:`on-this-page`,children:`On this page`}),`
`,(0,y.jsx)(t.p,{children:`Links to the sections of a long text page, such as Privacy or Accessibility, with a marker on the section in view. It is the On this page component of the design system in Penpot, and its links are On this page link.`}),`
`,(0,y.jsx)(a,{of:p}),`
`,(0,y.jsx)(t.p,{children:`Below the breakpoint, the links sit in a closed Disclosure:`}),`
`,(0,y.jsx)(a,{of:l}),`
`,(0,y.jsx)(t.h2,{id:`placing-it`,children:`Placing it`}),`
`,(0,y.jsxs)(t.p,{children:[`On this page is an attribute on `,(0,y.jsx)(t.code,{children:`<nav>`}),`. Project it into a Text page, which places it beside the prose on Desktop and under the title block on Mobile, or place it in a column of its own beside the article. Project one `,(0,y.jsx)(t.code,{children:`<li>`}),` per section, each holding an On this page link to the id of the heading of its section. The nav puts the items in a list of its own under its title, so the links reach assistive technology as a list:`]}),`
`,(0,y.jsx)(t.pre,{children:(0,y.jsx)(t.code,{className:`language-html`,children:`<nav dma-on-this-page>
    <li><a dma-on-this-page-link href="#who-is-responsible">Who is responsible</a></li>
    <li><a dma-on-this-page-link href="#your-rights">Your rights</a></li>
</nav>
`})}),`
`,(0,y.jsxs)(t.p,{children:[`The nav fills the column the page gives it, so on Desktop the page sets the 240 px of Penpot, `,(0,y.jsx)(t.code,{children:`size.on-this-page`}),`, as Text page does. There it sticks 24 px (space.24) below the top of the viewport while the article scrolls. In a grid or flex column it keeps its own height, which leaves it room to stick.`]}),`
`,(0,y.jsx)(t.h2,{id:`layouts`,children:`Layouts`}),`
`,(0,y.jsxs)(t.p,{children:[`The layout follows the viewport, and switches at the desktop breakpoint, `,(0,y.jsx)(t.code,{children:`$breakpoint-desktop`}),` from `,(0,y.jsx)(t.code,{children:`@critsource/design-tokens/breakpoints.scss`}),`. Both layouts show the same links, since content projects only once, so CSS switches between them with no script, and the nav renders the same on the server.`]}),`
`,(0,y.jsx)(t.p,{children:`From the breakpoint up, the nav shows its title over the links. Below it, the links sit in the panel of a Disclosure, whose summary shows the title. The panel starts closed, opens and closes as Disclosure does, and the nav stays in the flow of the page:`}),`
`,(0,y.jsx)(a,{of:f}),`
`,(0,y.jsxs)(t.p,{children:[`The nav renders the Disclosure in both layouts. From the breakpoint up, it hides the summary and the box of the Disclosure, and shows the links whether or not the panel is open, through `,(0,y.jsx)(t.code,{children:`::details-content`}),`.`]}),`
`,(0,y.jsx)(t.h2,{id:`marking-the-section-in-view`,children:`Marking the section in view`}),`
`,(0,y.jsx)(t.p,{children:`The nav marks the link of the section in view: the last section whose heading has reached the top third of the viewport. The section stays marked while the reader reads the rest of it, and before the first heading, the first link is marked. The nav never marks a link whose heading is missing from the page. Scroll the article to see the mark follow it:`}),`
`,(0,y.jsx)(a,{of:_}),`
`,(0,y.jsxs)(t.p,{children:[`The nav watches the headings with an `,(0,y.jsx)(t.code,{children:`IntersectionObserver`}),` once it has rendered in the browser, and stops when it is destroyed. On the server it renders with no link marked. A heading counts as reached once the document scrolls it up, so the page scrolls the document rather than a container of its own.`]}),`
`,(0,y.jsx)(t.h3,{id:`accessibility`,children:`Accessibility`}),`
`,(0,y.jsxs)(t.p,{children:[`The title "On this page" names the nav through `,(0,y.jsx)(t.code,{children:`aria-labelledby`}),`, so screen readers announce it as the On this page navigation. It names the nav on Mobile too, where it hides. The title is not a heading, so it stays out of the outline of the page.`]}),`
`,(0,y.jsxs)(t.p,{children:[`On Mobile, the summary is the target, at least 44 px tall, and a pointer, Enter, or Space opens the panel. The links of a closed panel stay out of the tab order. On Desktop, the hidden summary is out of the tab order, so Tab moves from link to link. The nav marks the link of the section in view with `,(0,y.jsx)(t.code,{children:`aria-current="location"`}),`, so screen readers announce it as the current location.`]}),`
`,(0,y.jsx)(t.h3,{id:`testing`,children:`Testing`}),`
`,(0,y.jsxs)(t.p,{children:[(0,y.jsx)(t.code,{children:`OnThisPageHarness`}),` from `,(0,y.jsx)(t.code,{children:`@critsource/ui-web/testing`}),` reads the nav in a test: the text and look of its title, which parts the current layout shows, the `,(0,y.jsx)(t.code,{children:`DisclosureHarness`}),` of its Disclosure, the harnesses of its links, the link that marks the section in view, where its parts start and end, its width, and how it sticks.`]}),`
`,(0,y.jsx)(t.h2,{id:`on-this-page-link`,children:`On this page link`}),`
`,(0,y.jsx)(t.p,{children:`A link to one section of the page.`}),`
`,(0,y.jsx)(a,{of:d}),`
`,(0,y.jsx)(i,{of:d}),`
`,(0,y.jsx)(t.h3,{id:`placing-a-link`,children:`Placing a link`}),`
`,(0,y.jsxs)(t.p,{children:[`On this page link is an attribute on `,(0,y.jsx)(t.code,{children:`<a>`}),`, so the element keeps the semantics and keyboard behavior of a native link. Point its `,(0,y.jsx)(t.code,{children:`href`}),` at the id of the heading of its section, and use the text of that heading as its label:`]}),`
`,(0,y.jsx)(t.pre,{children:(0,y.jsx)(t.code,{className:`language-html`,children:`<a dma-on-this-page-link href="#your-rights">Your rights</a>
`})}),`
`,(0,y.jsx)(t.p,{children:`The link fills its container. Stacked, the indicators at their starts draw a track down the list:`}),`
`,(0,y.jsx)(a,{of:g}),`
`,(0,y.jsx)(t.h3,{id:`hover`,children:`Hover`}),`
`,(0,y.jsx)(t.p,{children:`The label turns to the default foreground color. The link draws no fill.`}),`
`,(0,y.jsx)(a,{of:m}),`
`,(0,y.jsx)(t.h3,{id:`focus`,children:`Focus`}),`
`,(0,y.jsx)(t.p,{children:`The link draws the focus ring outside itself on keyboard focus, and keeps the colors of its state.`}),`
`,(0,y.jsx)(a,{of:c}),`
`,(0,y.jsx)(t.h3,{id:`current`,children:`Current`}),`
`,(0,y.jsxs)(t.p,{children:[`The link of the section in view turns its label and its indicator to the accent color, and keeps them on hover and focus. It reads the state from `,(0,y.jsx)(t.code,{children:`aria-current="location"`}),` on the link, which the nav sets, and which also tells assistive technology:`]}),`
`,(0,y.jsx)(t.pre,{children:(0,y.jsx)(t.code,{className:`language-html`,children:`<a dma-on-this-page-link href="#your-rights" aria-current="location">Your rights</a>
`})}),`
`,(0,y.jsx)(a,{of:h}),`
`,(0,y.jsx)(t.h3,{id:`accessibility-1`,children:`Accessibility`}),`
`,(0,y.jsxs)(t.p,{children:[`The projected heading names the link to assistive technology. The current state comes from `,(0,y.jsx)(t.code,{children:`aria-current="location"`}),` rather than a class, so screen readers announce it as the current location, and color is not the only cue.`]}),`
`,(0,y.jsx)(t.p,{children:`The link is 37 px tall on one line, as Penpot draws it. That is below the 44 px minimum target size that Nav link keeps, but above the 24 px that WCAG 2.5.8 asks for, and the links stack with no gap, so each row of the list is a target.`}),`
`,(0,y.jsx)(t.h3,{id:`testing-1`,children:`Testing`}),`
`,(0,y.jsxs)(t.p,{children:[(0,y.jsx)(t.code,{children:`OnThisPageLinkHarness`}),` from `,(0,y.jsx)(t.code,{children:`@critsource/ui-web/testing`}),` reads a link in a test: its text, its colors and font weight, its size, padding, and corners, whether it marks the section in view, its indicator, and its focus ring.`]})]})}function MDXContent(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,y.jsx)(t,{...e,children:(0,y.jsx)(_createMdxContent,{...e})}):_createMdxContent(e)}var y;function init_on_this_page(){return(init_on_this_page=e((()=>{y=s(),t(),r(),v()})))()}init_on_this_page();export{MDXContent as default};