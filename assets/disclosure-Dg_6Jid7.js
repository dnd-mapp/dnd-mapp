import{n as e}from"./rolldown-runtime-vtgMY1y5.js";import{N as t,P as n,c as r,i,n as a,s as o,x as s}from"./blocks-CDxrhzRn.js";import{a as c,c as l,i as u,l as d,n as f,o as p,r as m,s as h,t as g}from"./disclosure.stories-CB16W85j.js";function _createMdxContent(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,...n(),...e.components};return(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)(o,{of:l}),`
`,(0,_.jsx)(t.h1,{id:`disclosure`,children:`Disclosure`}),`
`,(0,_.jsx)(t.p,{children:`Content that opens on demand, such as the answer to a question. It is the Disclosure component of the design system in Penpot, and On this page holds it on Mobile.`}),`
`,(0,_.jsx)(a,{of:g}),`
`,(0,_.jsx)(i,{of:g}),`
`,(0,_.jsx)(t.h2,{id:`placing-a-disclosure`,children:`Placing a disclosure`}),`
`,(0,_.jsxs)(t.p,{children:[`Disclosure is an attribute on `,(0,_.jsx)(t.code,{children:`<details>`}),`, so the browser opens and closes it with no script. Mark the label of the summary with `,(0,_.jsx)(t.code,{children:`dma-disclosure-summary`}),`, and put the content of the panel after it. Add `,(0,_.jsx)(t.code,{children:`open`}),` to start with the panel open:`]}),`
`,(0,_.jsx)(t.pre,{children:(0,_.jsx)(t.code,{className:`language-html`,children:`<details dma-disclosure>
    <span dma-disclosure-summary>What is a saving throw?</span>
    <p>A roll that decides whether a creature resists a spell, a trap, or a poison.</p>
</details>
`})}),`
`,(0,_.jsxs)(t.p,{children:[`The disclosure renders the `,(0,_.jsx)(t.code,{children:`<summary>`}),` itself and projects the label into it, so it can end the summary in its icon. The `,(0,_.jsx)(t.code,{children:`open`}),` attribute holds the state, and the native `,(0,_.jsx)(t.code,{children:`toggle`}),` event fires each time the panel opens or closes, so Disclosure has no inputs or outputs of its own.`]}),`
`,(0,_.jsx)(t.p,{children:`The disclosure fills its container up to the measure. Stack several, as for questions and answers, and the divider under each one separates them:`}),`
`,(0,_.jsx)(a,{of:h}),`
`,(0,_.jsx)(t.h2,{id:`panel`,children:`Panel`}),`
`,(0,_.jsx)(t.h3,{id:`closed`,children:`Closed`}),`
`,(0,_.jsx)(t.p,{children:`The panel starts closed: the summary shows the label and ends in a plus.`}),`
`,(0,_.jsx)(t.h3,{id:`open`,children:`Open`}),`
`,(0,_.jsx)(t.p,{children:`The open panel shows its content in muted body text, and the summary ends in a minus. The panel keeps the spacing between its paragraphs, but none above the first or below the last.`}),`
`,(0,_.jsx)(a,{of:u}),`
`,(0,_.jsx)(t.h2,{id:`hover`,children:`Hover`}),`
`,(0,_.jsx)(t.p,{children:`The summary fills its box, whether the panel is closed or open.`}),`
`,(0,_.jsx)(a,{of:m}),`
`,(0,_.jsx)(a,{of:p}),`
`,(0,_.jsx)(t.h2,{id:`focus`,children:`Focus`}),`
`,(0,_.jsx)(t.p,{children:`The summary draws the focus ring outside itself on keyboard focus, and keeps the look of its default state. A click focuses the summary but draws no ring.`}),`
`,(0,_.jsx)(a,{of:f}),`
`,(0,_.jsx)(a,{of:c}),`
`,(0,_.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,_.jsx)(t.p,{children:`The whole summary is the target, at least 44 px tall, the minimum target size. A pointer, Enter, or Space on the focused summary opens and closes the panel. The icons hide themselves, so the label alone names the summary.`}),`
`,(0,_.jsx)(t.p,{children:`The content of a closed panel stays in the page. Browsers that support it, such as Chrome and Edge, open a closed panel when find in page matches its text.`}),`
`,(0,_.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,_.jsxs)(t.p,{children:[(0,_.jsx)(t.code,{children:`DisclosureHarness`}),` from `,(0,_.jsx)(t.code,{children:`@critsource/ui-web/testing`}),` reads a disclosure in a test: its summary and panel text, whether it is open, the icon it shows, the fill and text of its summary and panel, the box and focus ring of its summary, its size, and its divider.`]}),`
`,(0,_.jsxs)(t.p,{children:[`No test can drive find in page, so `,(0,_.jsx)(t.code,{children:`isPanelFindable()`}),` checks what find in page needs instead: the panel holds text, and hides none of it through its display, visibility, content visibility, or `,(0,_.jsx)(t.code,{children:`inert`}),`.`]})]})}function MDXContent(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,_.jsx)(t,{...e,children:(0,_.jsx)(_createMdxContent,{...e})}):_createMdxContent(e)}var _;function init_disclosure(){return(init_disclosure=e((()=>{_=s(),t(),r(),d()})))()}init_disclosure();export{MDXContent as default};