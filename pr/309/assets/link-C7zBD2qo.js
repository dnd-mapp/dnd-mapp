import{n as e}from"./rolldown-runtime-vtgMY1y5.js";import{N as t,P as n,c as r,i,n as a,s as o,x as s}from"./blocks-CDxrhzRn.js";import{a as c,c as l,d as u,f as d,i as f,l as p,n as m,o as h,r as g,s as _,t as v,u as y}from"./link.stories-D284jdpR.js";function _createMdxContent(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,...n(),...e.components};return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(o,{of:d}),`
`,(0,b.jsx)(t.h1,{id:`link`,children:`Link`}),`
`,(0,b.jsx)(t.p,{children:`A link to another page or site, inside text or on its own. It is the Link component of the design system in Penpot, and Card, Link group, Footer, and Text page hold it.`}),`
`,(0,b.jsx)(a,{of:m}),`
`,(0,b.jsx)(i,{of:m}),`
`,(0,b.jsx)(t.h2,{id:`placing-a-link`,children:`Placing a link`}),`
`,(0,b.jsxs)(t.p,{children:[`Link is an attribute on `,(0,b.jsx)(t.code,{children:`<a>`}),`, so the element keeps the semantics and keyboard behavior of a native link. Add `,(0,b.jsx)(t.code,{children:`routerLink`}),` for a page of the app, or `,(0,b.jsx)(t.code,{children:`href`}),` for another site; Link needs no router:`]}),`
`,(0,b.jsx)(t.pre,{children:(0,b.jsx)(t.code,{className:`language-html`,children:`<a dma-link routerLink="/rules">Rules</a>

<a dma-link kind="standalone" href="https://github.com/dnd-mapp/dnd-mapp">View on GitHub</a>
`})}),`
`,(0,b.jsx)(t.h2,{id:`kind`,children:`Kind`}),`
`,(0,b.jsxs)(t.p,{children:[(0,b.jsx)(t.code,{children:`kind`}),` picks how the link looks. Each kind draws a default, a hover, and a focus state.`]}),`
`,(0,b.jsx)(t.h3,{id:`inline`,children:`Inline`}),`
`,(0,b.jsxs)(t.p,{children:[(0,b.jsx)(t.code,{children:`LinkKind.Inline`}),`, the default, sits in a line of body text. It is underlined in every state, so color is not the only cue, and it turns to the default foreground color on hover.`]}),`
`,(0,b.jsx)(a,{of:v}),`
`,(0,b.jsx)(a,{of:f}),`
`,(0,b.jsx)(t.h3,{id:`standalone`,children:`Standalone`}),`
`,(0,b.jsxs)(t.p,{children:[(0,b.jsx)(t.code,{children:`LinkKind.Standalone`}),` sits on a line of its own, such as at the end of a card. It is bold, ends in an arrow, and gets its underline on hover.`]}),`
`,(0,b.jsx)(a,{of:l}),`
`,(0,b.jsx)(a,{of:y}),`
`,(0,b.jsx)(t.h3,{id:`quiet`,children:`Quiet`}),`
`,(0,b.jsxs)(t.p,{children:[(0,b.jsx)(t.code,{children:`LinkKind.Quiet`}),` sits in a list of links, such as Link group or Footer. It draws as muted body text, and reads as a link on hover.`]}),`
`,(0,b.jsx)(a,{of:c}),`
`,(0,b.jsx)(a,{of:_}),`
`,(0,b.jsx)(t.h2,{id:`focus`,children:`Focus`}),`
`,(0,b.jsx)(t.p,{children:`Every kind draws the focus ring outside itself on keyboard focus, and keeps the colors of its default state.`}),`
`,(0,b.jsx)(a,{of:g}),`
`,(0,b.jsx)(a,{of:p}),`
`,(0,b.jsx)(a,{of:h}),`
`,(0,b.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,b.jsx)(t.p,{children:`The projected content names the link to assistive technology. The arrow of a standalone link hides itself, so screen readers announce the label alone. Write a label that says where the link goes, rather than "Read more", since a screen reader may list the links of a page out of context.`}),`
`,(0,b.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,b.jsxs)(t.p,{children:[(0,b.jsx)(t.code,{children:`LinkHarness`}),` from `,(0,b.jsx)(t.code,{children:`@dnd-mapp/ui-web/testing`}),` reads a link in a test: its text, its color, its font weight, whether it is underlined, its focus ring, and its arrow.`]})]})}function MDXContent(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,b.jsx)(t,{...e,children:(0,b.jsx)(_createMdxContent,{...e})}):_createMdxContent(e)}var b;function init_link(){return(init_link=e((()=>{b=s(),t(),r(),u()})))()}init_link();export{MDXContent as default};