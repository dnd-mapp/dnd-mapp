import{n as e}from"./rolldown-runtime-vtgMY1y5.js";import{N as t,P as n,c as r,i,n as a,s as o,x as s}from"./blocks-CDxrhzRn.js";import{n as c,r as l,t as u}from"./link-group.stories-D0iJip9A.js";function _createMdxContent(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(o,{of:l}),`
`,(0,d.jsx)(t.h1,{id:`link-group`,children:`Link group`}),`
`,(0,d.jsx)(t.p,{children:`A heading with a list of related links, such as a column of the footer. It is the Link group component of the design system in Penpot, and Footer holds it.`}),`
`,(0,d.jsx)(a,{of:u}),`
`,(0,d.jsx)(i,{of:u}),`
`,(0,d.jsx)(t.h2,{id:`placing-a-link-group`,children:`Placing a link group`}),`
`,(0,d.jsxs)(t.p,{children:[`Link group projects a heading and one `,(0,d.jsx)(t.code,{children:`<li>`}),` per link, and puts the items in a list of its own. Place a quiet link, `,(0,d.jsx)(t.code,{children:`a[dma-link]`}),` with `,(0,d.jsx)(t.code,{children:`kind="quiet"`}),`, in each item:`]}),`
`,(0,d.jsx)(t.pre,{children:(0,d.jsx)(t.code,{className:`language-html`,children:`<dma-link-group>
    <h2>Project</h2>
    <li><a dma-link kind="quiet" href="https://github.com/critsource/critsource">Source code</a></li>
    <li><a dma-link kind="quiet" routerLink="/changelog">Changelog</a></li>
</dma-link-group>
`})}),`
`,(0,d.jsxs)(t.p,{children:[`Pick the heading level that fits the outline of the page, from `,(0,d.jsx)(t.code,{children:`<h1>`}),` to `,(0,d.jsx)(t.code,{children:`<h6>`}),`. The heading draws the same at every level. An `,(0,d.jsx)(t.code,{children:`@for`}),` block can project the items, as long as each pass renders one `,(0,d.jsx)(t.code,{children:`<li>`}),`. The link group drops any other content.`]}),`
`,(0,d.jsx)(t.p,{children:`The link group fills the column it is placed in, while its heading and links keep their own width, so whoever holds it sizes the columns.`}),`
`,(0,d.jsx)(t.h2,{id:`focus`,children:`Focus`}),`
`,(0,d.jsx)(t.p,{children:`A link group takes no focus, and Penpot draws it in one state, since it is not interactive itself. Each link draws its own hover and focus states, as the docs page of Link shows.`}),`
`,(0,d.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,d.jsx)(t.p,{children:`Assistive technology reads the heading at the level you pick, then the links as a list with its number of items. The list keeps its list role in Safari too, which drops the role of a list without markers unless the list sets it explicitly.`}),`
`,(0,d.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,d.jsxs)(t.p,{children:[(0,d.jsx)(t.code,{children:`LinkGroupHarness`}),` from `,(0,d.jsx)(t.code,{children:`@critsource/ui-web/testing`}),` reads a link group in a test: the text and look of its heading, the `,(0,d.jsx)(t.code,{children:`LinkHarness`}),` of each link, the place and width of the heading, the list, and each item, and its own width.`]})]})}function MDXContent(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,d.jsx)(t,{...e,children:(0,d.jsx)(_createMdxContent,{...e})}):_createMdxContent(e)}var d;function init_link_group(){return(init_link_group=e((()=>{d=s(),t(),r(),c()})))()}init_link_group();export{MDXContent as default};