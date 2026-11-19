import{n as e}from"./rolldown-runtime-vtgMY1y5.js";import{N as t,P as n,c as r,i,n as a,s as o,x as s}from"./blocks-CDxrhzRn.js";import{a as c,i as l,n as u,o as d,r as f,t as p}from"./section.stories-DLjFdQd4.js";function _createMdxContent(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:d}),`
`,(0,m.jsx)(t.h1,{id:`section`,children:`Section`}),`
`,(0,m.jsx)(t.p,{children:`A full-width band of a page, such as a part of the landing page, which stacks its content in a column. It is the Section component of the design system in Penpot.`}),`
`,(0,m.jsx)(a,{of:p}),`
`,(0,m.jsx)(i,{of:p}),`
`,(0,m.jsx)(t.h2,{id:`placing-a-section`,children:`Placing a section`}),`
`,(0,m.jsxs)(t.p,{children:[`Section is an attribute on `,(0,m.jsx)(t.code,{children:`<section>`}),`, which projects its content, usually a Section intro and what follows it:`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-html`,children:`<section dma-section aria-labelledby="tools-heading">
    <hgroup dma-section-intro>
        <p>Tools</p>
        <h2 id="tools-heading">Everything at the table</h2>
        <p>Maps, notes, and rules in one place.</p>
    </hgroup>
    <ul class="cards" role="list">
        ...
    </ul>
</section>
`})}),`
`,(0,m.jsx)(t.p,{children:`The section fills its container, and centers its content in a column at most 1200 px wide. It stacks the children of that column with the section gap, stretches each across the column, and drops their margins. A child with a width of its own keeps it, so a Section intro stays within the measure.`}),`
`,(0,m.jsx)(t.h2,{id:`background`,children:`Background`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`background`}),` picks what the section fills itself with, so a run of sections can tell one from the next. An unknown value draws the default.`]}),`
`,(0,m.jsx)(t.h3,{id:`page`,children:`Page`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`SectionBackground.Page`}),`, the default, fills the section with the page background, as the section at the top of this page shows.`]}),`
`,(0,m.jsx)(t.h3,{id:`surface`,children:`Surface`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`SectionBackground.Surface`}),` fills the section with the surface background. Place a Card on it with the raised background, so the card stands one step above the section.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-html`,children:`<section dma-section background="surface">...</section>
`})}),`
`,(0,m.jsx)(a,{of:f}),`
`,(0,m.jsx)(t.h2,{id:`viewport`,children:`Viewport`}),`
`,(0,m.jsx)(t.p,{children:`The padding and the gap follow the Viewport tokens, so the section needs no input for the viewport. Below the desktop breakpoint, it pads itself 56 px above and below and 20 px at the sides, and stacks its children 28 px apart. From the breakpoint up, those grow to 96 px, 120 px, and 40 px.`}),`
`,(0,m.jsx)(a,{of:u}),`
`,(0,m.jsx)(a,{of:l}),`
`,(0,m.jsx)(t.h2,{id:`focus`,children:`Focus`}),`
`,(0,m.jsx)(t.p,{children:`A section takes no focus, and Penpot draws no hover or focus state for it, since it is not interactive.`}),`
`,(0,m.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,m.jsxs)(t.p,{children:[`A `,(0,m.jsx)(t.code,{children:`<section>`}),` is a region landmark only once it has a name. Give a section that a reader should find in the list of landmarks an `,(0,m.jsx)(t.code,{children:`aria-labelledby`}),` that points at its heading, as the example above does. Without a name, assistive technology reads its content as part of the page.`]}),`
`,(0,m.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`SectionHarness`}),` from `,(0,m.jsx)(t.code,{children:`@critsource/ui-web/testing`}),` reads a section in a test: the text of its content, the look of its box, the place of its content and of each child, and its size.`]})]})}function MDXContent(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(_createMdxContent,{...e})}):_createMdxContent(e)}var m;function init_section(){return(init_section=e((()=>{m=s(),t(),r(),c()})))()}init_section();export{MDXContent as default};