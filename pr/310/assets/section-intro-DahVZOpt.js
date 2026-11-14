import{n as e}from"./rolldown-runtime-vtgMY1y5.js";import{N as t,P as n,c as r,i,n as a,s as o,x as s}from"./blocks-CDxrhzRn.js";import{i as c,n as l,r as u,t as d}from"./section-intro.stories-CWF-1ciZ.js";function _createMdxContent(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,...n(),...e.components};return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(o,{of:c}),`
`,(0,f.jsx)(t.h1,{id:`section-intro`,children:`Section intro`}),`
`,(0,f.jsx)(t.p,{children:`The opening of a content section: an eyebrow, a heading, and intro text. It is the Section intro component of the design system in Penpot, and Section holds it.`}),`
`,(0,f.jsx)(a,{of:l}),`
`,(0,f.jsx)(i,{of:l}),`
`,(0,f.jsx)(t.h2,{id:`placing-a-section-intro`,children:`Placing a section intro`}),`
`,(0,f.jsxs)(t.p,{children:[`Section intro is an attribute on `,(0,f.jsx)(t.code,{children:`<hgroup>`}),`, which projects its three parts. The `,(0,f.jsx)(t.code,{children:`<p>`}),` before the heading is the eyebrow, and the `,(0,f.jsx)(t.code,{children:`<p>`}),` after it the intro text:`]}),`
`,(0,f.jsx)(t.pre,{children:(0,f.jsx)(t.code,{className:`language-html`,children:`<hgroup dma-section-intro>
    <p>Tools</p>
    <h2>Everything at the table</h2>
    <p>Maps, notes, and rules in one place.</p>
</hgroup>
`})}),`
`,(0,f.jsxs)(t.p,{children:[`Pick the heading level that fits the outline of the page, from `,(0,f.jsx)(t.code,{children:`<h1>`}),` to `,(0,f.jsx)(t.code,{children:`<h6>`}),`. The heading draws the same at every level. The eyebrow and the intro text are optional.`]}),`
`,(0,f.jsx)(t.p,{children:`The section intro fills its container up to the measure, so lines of intro text stay readable. It leaves its own place in the container to the section that holds it.`}),`
`,(0,f.jsx)(t.h2,{id:`align`,children:`Align`}),`
`,(0,f.jsxs)(t.p,{children:[(0,f.jsx)(t.code,{children:`align`}),` picks how the section intro aligns its text. Penpot draws no hover or focus state, since a section intro is not interactive.`]}),`
`,(0,f.jsx)(t.h3,{id:`start`,children:`Start`}),`
`,(0,f.jsxs)(t.p,{children:[(0,f.jsx)(t.code,{children:`SectionIntroAlign.Start`}),`, the default, aligns every part to the start of the line, as the section intro at the top of this page shows.`]}),`
`,(0,f.jsx)(t.h3,{id:`center`,children:`Center`}),`
`,(0,f.jsxs)(t.p,{children:[(0,f.jsx)(t.code,{children:`SectionIntroAlign.Center`}),` centers every part on its line.`]}),`
`,(0,f.jsx)(a,{of:d}),`
`,(0,f.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,f.jsx)(t.p,{children:`Assistive technology reads the parts in their order: the eyebrow and the intro text as paragraphs, and the heading at the level you pick, named by its own text. Since the eyebrow stays out of the heading, a list of headings reads "Everything at the table", not "Tools Everything at the table".`}),`
`,(0,f.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,f.jsxs)(t.p,{children:[(0,f.jsx)(t.code,{children:`SectionIntroHarness`}),` from `,(0,f.jsx)(t.code,{children:`@dnd-mapp/ui-web/testing`}),` reads a section intro in a test: the text, look, and place of each part, and its width.`]})]})}function MDXContent(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,f.jsx)(t,{...e,children:(0,f.jsx)(_createMdxContent,{...e})}):_createMdxContent(e)}var f;function init_section_intro(){return(init_section_intro=e((()=>{f=s(),t(),r(),u()})))()}init_section_intro();export{MDXContent as default};