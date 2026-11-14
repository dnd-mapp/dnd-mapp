import{n as e}from"./rolldown-runtime-vtgMY1y5.js";import{N as t,P as n,c as r,i,n as a,s as o,x as s}from"./blocks-CDxrhzRn.js";import{n as c,r as l,t as u}from"./section-intro.stories-DUQPomxS.js";function _createMdxContent(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(o,{of:l}),`
`,(0,d.jsx)(t.h1,{id:`section-intro`,children:`Section intro`}),`
`,(0,d.jsx)(t.p,{children:`The opening of a content section: an eyebrow, a heading, and intro text. It is the Section intro component of the design system in Penpot, and Section holds it.`}),`
`,(0,d.jsx)(a,{of:u}),`
`,(0,d.jsx)(i,{of:u}),`
`,(0,d.jsx)(t.h2,{id:`placing-a-section-intro`,children:`Placing a section intro`}),`
`,(0,d.jsxs)(t.p,{children:[`Section intro is an attribute on `,(0,d.jsx)(t.code,{children:`<hgroup>`}),`, which projects its three parts. The `,(0,d.jsx)(t.code,{children:`<p>`}),` before the heading is the eyebrow, and the `,(0,d.jsx)(t.code,{children:`<p>`}),` after it the intro text:`]}),`
`,(0,d.jsx)(t.pre,{children:(0,d.jsx)(t.code,{className:`language-html`,children:`<hgroup dma-section-intro>
    <p>Tools</p>
    <h2>Everything at the table</h2>
    <p>Maps, notes, and rules in one place.</p>
</hgroup>
`})}),`
`,(0,d.jsxs)(t.p,{children:[`Pick the heading level that fits the outline of the page, from `,(0,d.jsx)(t.code,{children:`<h1>`}),` to `,(0,d.jsx)(t.code,{children:`<h6>`}),`. The heading draws the same at every level. The eyebrow and the intro text are optional.`]}),`
`,(0,d.jsx)(t.p,{children:`The section intro fills its container up to the measure, so lines of intro text stay readable. It leaves its own place in the container to the section that holds it.`}),`
`,(0,d.jsx)(t.p,{children:`The section intro aligns every part to the start of the line. Penpot draws no hover or focus state, since a section intro is not interactive.`}),`
`,(0,d.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,d.jsx)(t.p,{children:`Assistive technology reads the parts in their order: the eyebrow and the intro text as paragraphs, and the heading at the level you pick, named by its own text. Since the eyebrow stays out of the heading, a list of headings reads "Everything at the table", not "Tools Everything at the table".`}),`
`,(0,d.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,d.jsxs)(t.p,{children:[(0,d.jsx)(t.code,{children:`SectionIntroHarness`}),` from `,(0,d.jsx)(t.code,{children:`@dnd-mapp/ui-web/testing`}),` reads a section intro in a test: the text, look, and place of each part, and its width.`]})]})}function MDXContent(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,d.jsx)(t,{...e,children:(0,d.jsx)(_createMdxContent,{...e})}):_createMdxContent(e)}var d;function init_section_intro(){return(init_section_intro=e((()=>{d=s(),t(),r(),c()})))()}init_section_intro();export{MDXContent as default};