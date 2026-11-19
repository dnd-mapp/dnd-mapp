import{n as e}from"./rolldown-runtime-vtgMY1y5.js";import{N as t,P as n,c as r,n as i,s as a,x as o}from"./blocks-CDxrhzRn.js";import{i as s,n as c,r as l,t as u}from"./facts-list.stories-BTfPDOmM.js";function _createMdxContent(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,...n(),...e.components};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(a,{of:l}),`
`,(0,d.jsx)(t.h1,{id:`facts-list`,children:`Facts list`}),`
`,(0,d.jsx)(t.p,{children:`Pairs of a term and a value, such as the facts at the top of the Accessibility page. It is the Facts list component of the design system in Penpot, and Summary holds it.`}),`
`,(0,d.jsx)(i,{of:u}),`
`,(0,d.jsx)(t.h2,{id:`placing-a-facts-list`,children:`Placing a facts list`}),`
`,(0,d.jsxs)(t.p,{children:[`Facts list is an attribute on `,(0,d.jsx)(t.code,{children:`<dl>`}),`. Wrap each pair of a `,(0,d.jsx)(t.code,{children:`<dt>`}),` and a `,(0,d.jsx)(t.code,{children:`<dd>`}),` in a `,(0,d.jsx)(t.code,{children:`<div>`}),`:`]}),`
`,(0,d.jsx)(t.pre,{children:(0,d.jsx)(t.code,{className:`language-html`,children:`<dl dma-facts-list>
    <div>
        <dt>Standard</dt>
        <dd>WCAG 2.2, level AA</dd>
    </div>
    <div>
        <dt>Status</dt>
        <dd>Partially conformant</dd>
    </div>
</dl>
`})}),`
`,(0,d.jsx)(t.p,{children:`A value may hold an inline Link. The facts list fills its container, and leaves its own place in the container to the section that holds it.`}),`
`,(0,d.jsx)(t.h2,{id:`viewport`,children:`Viewport`}),`
`,(0,d.jsxs)(t.p,{children:[`The layout follows the desktop breakpoint of `,(0,d.jsx)(t.code,{children:`@critsource/design-tokens`}),`, so the facts list takes no input for it.`]}),`
`,(0,d.jsx)(t.h3,{id:`desktop`,children:`Desktop`}),`
`,(0,d.jsx)(t.p,{children:`From the breakpoint up, each term sits in a column of its own beside its value, as the facts list at the top of this page shows. A long value wraps within its own column.`}),`
`,(0,d.jsx)(t.h3,{id:`mobile`,children:`Mobile`}),`
`,(0,d.jsx)(t.p,{children:`Below the breakpoint, each term stacks above its value, since the column of terms would leave the values too little room.`}),`
`,(0,d.jsx)(i,{of:c,story:{inline:!1,height:`16rem`}}),`
`,(0,d.jsx)(t.h2,{id:`focus`,children:`Focus`}),`
`,(0,d.jsx)(t.p,{children:`A facts list takes no focus, and Penpot draws no hover or focus state for it, since it is not interactive. A Link in a value draws its own focus ring.`}),`
`,(0,d.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,d.jsxs)(t.p,{children:[`The `,(0,d.jsx)(t.code,{children:`<div>`}),` around each pair keeps the list valid HTML, so assistive technology reads each term with its value, and announces the pairs as one list.`]}),`
`,(0,d.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,d.jsxs)(t.p,{children:[(0,d.jsx)(t.code,{children:`FactsListHarness`}),` from `,(0,d.jsx)(t.code,{children:`@critsource/ui-web/testing`}),` reads a facts list in a test: the term and value of each fact, the look and place of each part, and its width.`]})]})}function MDXContent(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,d.jsx)(t,{...e,children:(0,d.jsx)(_createMdxContent,{...e})}):_createMdxContent(e)}var d;function init_facts_list(){return(init_facts_list=e((()=>{d=o(),t(),r(),s()})))()}init_facts_list();export{MDXContent as default};