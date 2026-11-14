import{n as e}from"./rolldown-runtime-vtgMY1y5.js";import{N as t,P as n,c as r,i,n as a,s as o,x as s}from"./blocks-CDxrhzRn.js";import{a as c,c as l,d as u,f as d,i as f,l as p,n as m,o as h,p as g,r as _,s as v,t as y,u as b}from"./nav-link.stories-CrtjKQVX.js";function _createMdxContent(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,...n(),...e.components};return(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(o,{of:g}),`
`,(0,x.jsx)(t.h1,{id:`nav-link`,children:`Nav link`}),`
`,(0,x.jsx)(t.p,{children:`A link to a page of the site in its navigation. It is the Nav link component of the design system in Penpot, and Header and Mobile menu hold it.`}),`
`,(0,x.jsx)(a,{of:f}),`
`,(0,x.jsx)(i,{of:f}),`
`,(0,x.jsx)(t.h2,{id:`placing-a-nav-link`,children:`Placing a nav link`}),`
`,(0,x.jsxs)(t.p,{children:[`Nav link is an attribute on `,(0,x.jsx)(t.code,{children:`<a>`}),`, so the element keeps the semantics and keyboard behavior of a native link. Add `,(0,x.jsx)(t.code,{children:`routerLink`}),` for a page of the app, or `,(0,x.jsx)(t.code,{children:`href`}),` for another site; Nav link needs no router. Place the nav links of a menu in a `,(0,x.jsx)(t.code,{children:`<nav>`}),`, so assistive technology announces them as navigation:`]}),`
`,(0,x.jsx)(t.pre,{children:(0,x.jsx)(t.code,{className:`language-html`,children:`<nav aria-label="Main">
    <a dma-nav-link routerLink="/features">Features</a>
    <a dma-nav-link routerLink="/roadmap">Roadmap</a>
</nav>
`})}),`
`,(0,x.jsx)(a,{of:v}),`
`,(0,x.jsx)(t.h2,{id:`kind`,children:`Kind`}),`
`,(0,x.jsxs)(t.p,{children:[(0,x.jsx)(t.code,{children:`kind`}),` picks how the nav link looks. Both kinds are at least 44 px tall, so they meet the minimum target size.`]}),`
`,(0,x.jsx)(t.h3,{id:`bar`,children:`Bar`}),`
`,(0,x.jsxs)(t.p,{children:[(0,x.jsx)(t.code,{children:`NavLinkKind.Bar`}),`, the default, sits in the bar of the header: it is as wide as its label. Its label is muted until the pointer is over it, or until it marks the current page.`]}),`
`,(0,x.jsx)(t.h3,{id:`row`,children:`Row`}),`
`,(0,x.jsxs)(t.p,{children:[(0,x.jsx)(t.code,{children:`NavLinkKind.Row`}),` is a row of a menu, such as Mobile menu: it fills its container, and its larger label takes the default foreground color.`]}),`
`,(0,x.jsx)(a,{of:p}),`
`,(0,x.jsx)(t.h2,{id:`states`,children:`States`}),`
`,(0,x.jsx)(t.h3,{id:`hover`,children:`Hover`}),`
`,(0,x.jsx)(t.p,{children:`The nav link fills its box, and a bar turns its label to the default foreground color.`}),`
`,(0,x.jsx)(a,{of:h}),`
`,(0,x.jsx)(a,{of:u}),`
`,(0,x.jsx)(t.h3,{id:`focus`,children:`Focus`}),`
`,(0,x.jsx)(t.p,{children:`The nav link draws the focus ring outside itself on keyboard focus, and keeps the colors of its default state.`}),`
`,(0,x.jsx)(a,{of:c}),`
`,(0,x.jsx)(a,{of:b}),`
`,(0,x.jsx)(t.h3,{id:`current`,children:`Current`}),`
`,(0,x.jsx)(t.p,{children:`The nav link to the current page draws a line in the accent color. A bar turns its label to the default foreground color and draws the line under its label, as wide as the label. A row turns its label to the accent color and draws the line at its start, as tall as the label. The nav link keeps the line and its label color on hover and on focus, so the reader can always tell which page they are on.`}),`
`,(0,x.jsxs)(t.p,{children:[`Nav link reads the current page from `,(0,x.jsx)(t.code,{children:`aria-current="page"`}),` on the link, which also tells assistive technology. With the router, `,(0,x.jsx)(t.code,{children:`routerLinkActive`}),` sets it on the link to the active route:`]}),`
`,(0,x.jsx)(t.pre,{children:(0,x.jsx)(t.code,{className:`language-html`,children:`<a dma-nav-link routerLink="/features" routerLinkActive ariaCurrentWhenActive="page">Features</a>
`})}),`
`,(0,x.jsx)(a,{of:y}),`
`,(0,x.jsx)(a,{of:_}),`
`,(0,x.jsx)(a,{of:m}),`
`,(0,x.jsx)(a,{of:l}),`
`,(0,x.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,x.jsxs)(t.p,{children:[`The projected content names the nav link to assistive technology. Write a label of a word or two that names the page, since the label is also all a screen reader announces. Mark the link to the current page with `,(0,x.jsx)(t.code,{children:`aria-current="page"`}),` rather than a class, so screen readers announce it as the current page, and color is not the only cue.`]}),`
`,(0,x.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,x.jsxs)(t.p,{children:[(0,x.jsx)(t.code,{children:`NavLinkHarness`}),` from `,(0,x.jsx)(t.code,{children:`@dnd-mapp/ui-web/testing`}),` reads a nav link in a test: its text, its colors and font weight, its size, padding, and corners, its focus ring, whether it marks the current page, and its indicator.`]})]})}function MDXContent(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,x.jsx)(t,{...e,children:(0,x.jsx)(_createMdxContent,{...e})}):_createMdxContent(e)}var x;function init_nav_link(){return(init_nav_link=e((()=>{x=s(),t(),r(),d()})))()}init_nav_link();export{MDXContent as default};