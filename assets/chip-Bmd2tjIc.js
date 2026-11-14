import{n as e}from"./rolldown-runtime-vtgMY1y5.js";import{N as t,P as n,c as r,i,n as a,s as o,x as s}from"./blocks-CDxrhzRn.js";import{a as c,i as l,n as u,o as d,r as f,t as p}from"./chip.stories-DMvCEvw_.js";function _createMdxContent(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:c}),`
`,(0,m.jsx)(t.h1,{id:`chip`,children:`Chip`}),`
`,(0,m.jsx)(t.p,{children:`A label for a status, role, tag, or condition. It is the Chip component of the design system in Penpot, and Card holds it.`}),`
`,(0,m.jsx)(a,{of:f}),`
`,(0,m.jsx)(i,{of:f}),`
`,(0,m.jsx)(t.h2,{id:`placing-a-chip`,children:`Placing a chip`}),`
`,(0,m.jsx)(t.p,{children:`Chip is an element that projects its label. It is a label, not a control: it takes no focus and emits nothing, so wrap no click handler around it.`}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-html`,children:`<dma-chip kind="status">Planned</dma-chip>
`})}),`
`,(0,m.jsx)(a,{of:u}),`
`,(0,m.jsx)(t.h2,{id:`kind`,children:`Kind`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`kind`}),` picks how the chip looks. No kind draws a hover or focus state, since a chip is not interactive.`]}),`
`,(0,m.jsx)(t.h3,{id:`neutral`,children:`Neutral`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`ChipKind.Neutral`}),`, the default, labels tool names and conditions, such as Spreadsheets or Poisoned. It draws the raised fill with a divider border, as the chip at the top of this page shows.`]}),`
`,(0,m.jsx)(t.h3,{id:`status`,children:`Status`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`ChipKind.Status`}),` marks a feature that is not built yet, such as Planned or Concept. It draws no fill, the border of a control, and muted text.`]}),`
`,(0,m.jsx)(a,{of:l}),`
`,(0,m.jsx)(t.h3,{id:`dm`,children:`DM`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`ChipKind.Dm`}),` marks a tool meant for dungeon masters. It draws the secondary fill.`]}),`
`,(0,m.jsx)(a,{of:p}),`
`,(0,m.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,m.jsx)(t.p,{children:`The projected text carries the meaning, so color is never the only cue: give every chip a label that makes sense on its own. The chip adds no role, so assistive technology reads its text as part of the content around it.`}),`
`,(0,m.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`ChipHarness`}),` from `,(0,m.jsx)(t.code,{children:`@dnd-mapp/ui-web/testing`}),` reads a chip in a test: its text, its look, and whether it has focus.`]})]})}function MDXContent(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(_createMdxContent,{...e})}):_createMdxContent(e)}var m;function init_chip(){return(init_chip=e((()=>{m=s(),t(),r(),d()})))()}init_chip();export{MDXContent as default};