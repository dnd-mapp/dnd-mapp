import{n as e}from"./rolldown-runtime-vtgMY1y5.js";import{N as t,P as n,c as r,n as i,s as a,x as o}from"./blocks-CDxrhzRn.js";import{i as s,n as c,r as l,t as u}from"./icon.stories-BcTTbnAR.js";function _createMdxContent(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(a,{of:l}),`
`,(0,d.jsx)(t.h1,{id:`icon`,children:`Icon`}),`
`,(0,d.jsxs)(t.p,{children:[`The glyphs of the Icon component of the design system in Penpot. Each glyph is a component of its own, named `,(0,d.jsx)(t.code,{children:`dma-icon-<glyph>`}),`.`]}),`
`,(0,d.jsx)(i,{of:u}),`
`,(0,d.jsx)(t.h2,{id:`placing-an-icon`,children:`Placing an icon`}),`
`,(0,d.jsxs)(t.p,{children:[`Place the component of the glyph you need. A component that holds an icon, such as a button, takes it through content projection, so any `,(0,d.jsx)(t.code,{children:`dma-icon-*`}),` fits and nothing looks an icon up by name:`]}),`
`,(0,d.jsx)(t.pre,{children:(0,d.jsx)(t.code,{className:`language-html`,children:`<a href="https://github.com/dnd-mapp/dnd-mapp">
    <dma-icon-github />
    GitHub
</a>
`})}),`
`,(0,d.jsx)(t.h2,{id:`size`,children:`Size`}),`
`,(0,d.jsx)(t.p,{children:`Every icon draws in a 24 px box, and grows with the reader's font size. It displays as a block, so it adds no line height of its own when it sits in a line of text.`}),`
`,(0,d.jsx)(t.h2,{id:`colors`,children:`Colors`}),`
`,(0,d.jsx)(t.p,{children:`Every icon draws in the color of its parent, so it follows the text color of the control that holds it in both color schemes, on hover, and when the control is disabled. The GitHub glyph fills its shape; the others stroke it.`}),`
`,(0,d.jsx)(i,{of:c}),`
`,(0,d.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,d.jsxs)(t.p,{children:[`Every icon hides itself from assistive technology, so screen readers skip it. The control that holds the icon carries the accessible name: give a control that shows an icon alone an `,(0,d.jsx)(t.code,{children:`aria-label`}),`:`]}),`
`,(0,d.jsx)(t.pre,{children:(0,d.jsx)(t.code,{className:`language-html`,children:`<button type="button" aria-label="Open the menu">
    <dma-icon-menu />
</button>
`})}),`
`,(0,d.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,d.jsxs)(t.p,{children:[(0,d.jsx)(t.code,{children:`IconHarness`}),` from `,(0,d.jsx)(t.code,{children:`@dnd-mapp/ui-web/testing`}),` reads any icon in a test: its glyph, whether it is hidden from assistive technology, the color it draws with, and its size.`]})]})}function MDXContent(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,d.jsx)(t,{...e,children:(0,d.jsx)(_createMdxContent,{...e})}):_createMdxContent(e)}var d;function init_icon(){return(init_icon=e((()=>{d=o(),t(),r(),s()})))()}init_icon();export{MDXContent as default};