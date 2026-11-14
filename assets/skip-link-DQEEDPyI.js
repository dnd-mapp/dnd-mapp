import{n as e}from"./rolldown-runtime-vtgMY1y5.js";import{N as t,P as n,c as r,i,n as a,s as o,x as s}from"./blocks-CDxrhzRn.js";import{a as c,i as l,n as u,r as d,t as f}from"./skip-link.stories-CcdV6-8J.js";function _createMdxContent(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:c}),`
`,(0,p.jsx)(t.h1,{id:`skip-link`,children:`Skip link`}),`
`,(0,p.jsx)(t.p,{children:`A link past the header to the main content, for readers who use a keyboard. It is the Skip link component of the design system in Penpot, and every page starts with it.`}),`
`,(0,p.jsx)(a,{of:f}),`
`,(0,p.jsx)(i,{of:f}),`
`,(0,p.jsx)(t.h2,{id:`placing-a-skip-link`,children:`Placing a skip link`}),`
`,(0,p.jsxs)(t.p,{children:[`Skip link is an attribute on `,(0,p.jsx)(t.code,{children:`<a>`}),`. Place it as the first focusable item of the page, before the header, and set `,(0,p.jsx)(t.code,{children:`href`}),` to the id of the main content:`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-html`,children:`<a dma-skip-link href="#main">Skip to main content</a>
<header>…</header>
<main id="main">…</main>
`})}),`
`,(0,p.jsxs)(t.p,{children:[`Activating the link moves focus to the element with that id, rather than following the link, since the `,(0,p.jsx)(t.code,{children:`<base href="/">`}),` of the app would resolve `,(0,p.jsx)(t.code,{children:`#main`}),` against the root page. An element that can't take focus by itself, such as `,(0,p.jsx)(t.code,{children:`<main>`}),`, gets `,(0,p.jsx)(t.code,{children:`tabindex="-1"`}),` until it loses focus again. When no element has the id, or `,(0,p.jsx)(t.code,{children:`href`}),` names another page, the link works as a native link.`]}),`
`,(0,p.jsx)(t.h2,{id:`states`,children:`States`}),`
`,(0,p.jsx)(t.h3,{id:`hidden`,children:`Hidden`}),`
`,(0,p.jsx)(t.p,{children:`The skip link stays hidden until it gets focus. It hides from sight only, so it stays in the accessibility tree and in the tab order.`}),`
`,(0,p.jsx)(a,{of:u}),`
`,(0,p.jsx)(t.h3,{id:`focus`,children:`Focus`}),`
`,(0,p.jsx)(t.p,{children:`On focus, the skip link pins to the top left of the viewport, 16 px from both edges and above the header. It draws the colors of the primary Button and the focus ring, and hides again once it loses focus. Penpot draws this state only, since the link shows only while it has focus; the story at the top of this page shows it.`}),`
`,(0,p.jsx)(t.p,{children:`Press Tab in the story below to show the skip link, then Enter to move focus to the main content:`}),`
`,(0,p.jsx)(a,{of:d}),`
`,(0,p.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,p.jsx)(t.p,{children:`The projected content names the skip link to assistive technology. Write a label that says where the link goes, such as "Skip to main content".`}),`
`,(0,p.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`SkipLinkHarness`}),` from `,(0,p.jsx)(t.code,{children:`@dnd-mapp/ui-web/testing`}),` reads a skip link in a test: its text, whether it shows, its colors and font weight, its place, height, padding, and corners, and its focus ring.`]})]})}function MDXContent(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(_createMdxContent,{...e})}):_createMdxContent(e)}var p;function init_skip_link(){return(init_skip_link=e((()=>{p=s(),t(),r(),l()})))()}init_skip_link();export{MDXContent as default};